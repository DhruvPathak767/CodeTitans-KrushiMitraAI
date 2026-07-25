import pandas as pd
import numpy as np

class FeatureEngineeringPipeline:
  """
  Feature engineering pipeline for Crop Market Price prediction.
  Generates date features, lag prices, moving averages, trend indicators,
  and categorical encodings for Random Forest Regressor.
  """
  def __init__(self):
      self.crop_encoder = {}
      self.market_encoder = {}
      self.district_encoder = {}

  def fit_transform(self, df: pd.DataFrame) -> pd.DataFrame:
      """
      Fits categorical encoders and transforms dataset into feature vectors.
      """
      df = df.copy()
      df['date'] = pd.to_datetime(df['date'])
      df = df.sort_values(by=['crop', 'market', 'date']).reset_index(drop=True)

      # 1. Date Features
      df['day'] = df['date'].dt.day
      df['week'] = df['date'].dt.isocalendar().week.astype(int)
      df['month'] = df['date'].dt.month
      df['year'] = df['date'].dt.year
      df['dayofweek'] = df['date'].dt.dayofweek

      # 2. Moving Averages & Lag Features (Grouped by Crop & Market)
      df['prev_price'] = df.groupby(['crop', 'market'])['price'].shift(1).bfill()
      df['ma_3'] = df.groupby(['crop', 'market'])['price'].transform(lambda x: x.rolling(3, min_periods=1).mean())
      df['ma_7'] = df.groupby(['crop', 'market'])['price'].transform(lambda x: x.rolling(7, min_periods=1).mean())
      df['ma_15'] = df.groupby(['crop', 'market'])['price'].transform(lambda x: x.rolling(15, min_periods=1).mean())
      
      # 3. Price Difference & Trend Indicator
      df['price_diff'] = df['price'] - df['prev_price']
      df['trend_indicator'] = np.where(df['price_diff'] > 0, 1, np.where(df['price_diff'] < 0, -1, 0))

      # 4. Categorical Label Encoders
      crops = df['crop'].unique().tolist()
      markets = df['market'].unique().tolist()
      districts = df['district'].unique().tolist()

      self.crop_encoder = {c: i for i, c in enumerate(crops)}
      self.market_encoder = {m: i for i, m in enumerate(markets)}
      self.district_encoder = {d: i for i, d in enumerate(districts)}

      df['crop_encoded'] = df['crop'].map(self.crop_encoder).fillna(-1).astype(int)
      df['market_encoded'] = df['market'].map(self.market_encoder).fillna(-1).astype(int)
      df['district_encoded'] = df['district'].map(self.district_encoder).fillna(-1).astype(int)

      return df

  def transform_single(self, crop: str, market: str, district: str, base_price: float, date_obj=None) -> pd.DataFrame:
      """
      Transforms single prediction request into feature row for Random Forest model.
      """
      if date_obj is None:
          date_obj = pd.Timestamp.now()
      else:
          date_obj = pd.to_datetime(date_obj)

      crop_enc = self.crop_encoder.get(crop, 0)
      market_enc = self.market_encoder.get(market, 0)
      district_enc = self.district_encoder.get(district, 0)

      feature_dict = {
          'day': date_obj.day,
          'week': int(date_obj.isocalendar().week),
          'month': date_obj.month,
          'year': date_obj.year,
          'dayofweek': date_obj.dayofweek,
          'prev_price': base_price,
          'ma_3': base_price,
          'ma_7': base_price,
          'ma_15': base_price,
          'price_diff': 0.0,
          'trend_indicator': 1,
          'crop_encoded': crop_enc,
          'market_encoded': market_enc,
          'district_encoded': district_enc,
      }

      return pd.DataFrame([feature_dict])

feature_pipeline_singleton = FeatureEngineeringPipeline()
