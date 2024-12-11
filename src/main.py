import joblib

from enum import Enum

import fastapi
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler


class SupportedCities(Enum):
    DELHI = 'Delhi'
    MUMBAI = 'Mumbai'
    BANGALORE = 'Bangalore'
    KOLKATA = 'Kolkata'
    HYDERABAD = 'Hyderabad'
    CHENNAI = 'Chennai'


class TimeOfDayBucket(Enum):
    EVENING = 'Evening'
    EARLY_MORNING = 'Early Morning'
    MORNING = 'Morning'
    AFTERNOON = 'Afternoon'
    NIGHT = 'Night'
    LATE_NIGHT = 'Late_Night'


class PredictionInput(BaseModel):
    source_city: SupportedCities
    departure_time: TimeOfDayBucket
    is_direct: bool
    arrival_time: TimeOfDayBucket
    destination_city: SupportedCities


app = FastAPI()


@app.post("/predict")
def predict():
    model: RandomForestRegressor = joblib.load("random_forest.pkl")
    scaler: StandardScaler = joblib.load("scaler.pkl")
    x = np.array([True, 130, 1, False, False, True, False, False, False, False, False, True, False, False, False, False,
         False, False, False, False, True, False, False, False, False, False, True
         ]).reshape(1, -1)
    return scaler.inverse_transform(model.predict(x).reshape(1, -1))
