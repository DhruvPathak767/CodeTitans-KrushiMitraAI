import os
import sys
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Ensure stdout uses UTF-8 encoding for Windows terminals
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Add parent directory to path to import app services
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from app.services.feature_engineering import FeatureEngineeringPipeline

def train_crop_price_model():
    print("Starting KrishiMitra Crop Price Prediction Model Training Pipeline...")

    csv_path = os.path.join(parent_dir, "datasets", "market_prices.csv")
    if not os.path.exists(csv_path):
        print(f"Dataset file not found at {csv_path}")
        sys.exit(1)

    print(f"Loading dataset from {csv_path}...")
    df = pd.read_csv(csv_path)
    print(f"Dataset Loaded: {len(df)} records across {df['crop'].nunique()} crops & {df['market'].nunique()} markets.")

    # 1. Feature Engineering
    pipeline = FeatureEngineeringPipeline()
    processed_df = pipeline.fit_transform(df)

    feature_cols = [
        'day', 'week', 'month', 'year', 'dayofweek',
        'prev_price', 'ma_3', 'ma_7', 'ma_15', 'price_diff',
        'trend_indicator', 'crop_encoded', 'market_encoded', 'district_encoded'
    ]

    X = processed_df[feature_cols]
    y = processed_df['price']

    # 2. Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 3. Model Training
    print("Training RandomForestRegressor Model...")
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=12,
        min_samples_split=2,
        random_state=42
    )
    rf_model.fit(X_train, y_train)

    # 4. Evaluation
    y_pred = rf_model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    cv_scores = cross_val_score(rf_model, X, y, cv=3, scoring='r2')
    cv_mean = cv_scores.mean()

    print("\n==========================================")
    print("MODEL EVALUATION METRICS")
    print("==========================================")
    print(f"• Mean Absolute Error (MAE): INR {mae:.2f}")
    print(f"• Root Mean Squared Error (RMSE): INR {rmse:.2f}")
    print(f"• R2 Score: {r2:.4f}")
    print(f"• 3-Fold Cross-Validation R2: {cv_mean:.4f}")

    print("\nFEATURE IMPORTANCE:")
    feature_importances = dict(zip(feature_cols, rf_model.feature_importances_))
    for feat, imp in sorted(feature_importances.items(), key=lambda item: item[1], reverse=True):
        print(f"  - {feat:20s}: {imp:.4f}")

    # 5. Model Persistence
    output_dir = os.path.join(parent_dir, "app", "models")
    os.makedirs(output_dir, exist_ok=True)
    model_save_path = os.path.join(output_dir, "random_forest.joblib")

    model_bundle = {
        "model": rf_model,
        "pipeline": pipeline,
        "feature_cols": feature_cols,
        "metrics": {
            "mae": mae,
            "rmse": rmse,
            "r2": r2,
            "cv_r2": cv_mean
        }
    }

    joblib.dump(model_bundle, model_save_path)
    print(f"\nModel bundle successfully saved to {model_save_path}")

if __name__ == "__main__":
    train_crop_price_model()
