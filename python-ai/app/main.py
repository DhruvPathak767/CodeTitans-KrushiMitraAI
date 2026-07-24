import sys
import os

# Add parent directory to PYTHONPATH so main.py and app module are resolvable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app, lifespan, root

__all__ = ["app", "lifespan", "root"]
