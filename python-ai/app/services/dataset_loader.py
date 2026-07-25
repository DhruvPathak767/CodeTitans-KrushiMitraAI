import os
import csv
import logging

try:
    import pandas as pd
    HAS_PANDAS = True
except Exception as e:
    pd = None
    HAS_PANDAS = False

logger = logging.getLogger("dataset_loader")

class StandardCsvDataset:
    def __init__(self, rows):
        self.rows = rows
        self.empty = len(rows) == 0

    def __getitem__(self, item):
        return self

    def filter_crop_market(self, crop, market):
        sub = [r for r in self.rows if r.get('crop', '').lower() == crop.lower() and r.get('market', '').lower() == market.lower()]
        if not sub:
            sub = [r for r in self.rows if r.get('crop', '').lower() == crop.lower()]
        return StandardCsvDataset(sub)

    @property
    def iloc(self):
        return self

    def __getitem__(self, idx):
        if isinstance(idx, int):
            return self.rows[idx]
        return self

class DatasetLoader:
    """
    Cached dataset loader for market prices CSV. Supports Pandas and pure-Python CSV fallback.
    """
    _instance = None
    _dataset = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatasetLoader, cls).__new__(cls)
        return cls._instance

    def load_dataset(self, csv_path: str = None):
        if self._dataset is not None:
            return self._dataset

        if csv_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            csv_path = os.path.join(base_dir, "..", "datasets", "market_prices.csv")

        if os.path.exists(csv_path):
            logger.info(f"Loading market dataset from {csv_path}...")
            if HAS_PANDAS and pd is not None:
                try:
                    self._dataset = pd.read_csv(csv_path)
                    return self._dataset
                except Exception as err:
                    logger.warning(f"Pandas read_csv failed: {err}. Falling back to standard CSV reader.")
            
            rows = []
            try:
                with open(csv_path, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        rows.append(row)
            except Exception as err:
                logger.error(f"Failed to read CSV: {err}")
            self._dataset = StandardCsvDataset(rows)
        else:
            logger.warning(f"Dataset CSV not found at {csv_path}. Creating fallback dataset.")
            if HAS_PANDAS and pd is not None:
                self._dataset = pd.DataFrame(columns=['date', 'crop', 'market', 'district', 'state', 'price', 'unit'])
            else:
                self._dataset = StandardCsvDataset([])

        return self._dataset

dataset_loader_singleton = DatasetLoader()
