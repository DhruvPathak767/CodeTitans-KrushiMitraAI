import os
import pandas as pd
import logging

logger = logging.getLogger("dataset_loader")

class DatasetLoader:
    """
    Cached dataset loader for market prices CSV.
    """
    _instance = None
    _dataset = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatasetLoader, cls).__new__(cls)
        return cls._instance

    def load_dataset(self, csv_path: str = None) -> pd.DataFrame:
        if self._dataset is not None:
            return self._dataset

        if csv_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            csv_path = os.path.join(base_dir, "..", "datasets", "market_prices.csv")

        if os.path.exists(csv_path):
            logger.info(f"Loading market dataset from {csv_path}...")
            self._dataset = pd.read_csv(csv_path)
        else:
            logger.warning(f"Dataset CSV not found at {csv_path}. Creating fallback DataFrame.")
            self._dataset = pd.DataFrame(columns=['date', 'crop', 'market', 'district', 'state', 'price', 'unit'])

        return self._dataset

dataset_loader_singleton = DatasetLoader()
