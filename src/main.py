import joblib

from enum import Enum

from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import numpy as np


class SupportedCities(Enum):
    DELHI = 'Delhi'
    MUMBAI = 'Mumbai'
    BANGALORE = 'Bangalore'
    KOLKATA = 'Kolkata'
    HYDERABAD = 'Hyderabad'
    CHENNAI = 'Chennai'


class TimeOfDayBucket(Enum):
    EVENING = 'Evening'
    EARLY_MORNING = 'Early_Morning'
    MORNING = 'Morning'
    AFTERNOON = 'Afternoon'
    NIGHT = 'Night'
    LATE_NIGHT = 'Late_Night'


class PredictionInput(BaseModel):
    source_city: SupportedCities
    departure_time: TimeOfDayBucket
    is_direct: bool
    duration: float
    days_left: float
    arrival_time: TimeOfDayBucket
    destination_city: SupportedCities


app = FastAPI()

pred_table = {
    'is_direct': False,
    'duration': 0,
    'days_left': 0,
    'source_city_Bangalore': False,
    'source_city_Chennai': False,'source_city_Delhi': False,'source_city_Hyderabad': False,
       'source_city_Kolkata': False,'source_city_Mumbai': False,'departure_time_Afternoon': False,
       'departure_time_Early_Morning': False,'departure_time_Evening': False,
       'departure_time_Late_Night': False,'departure_time_Morning': False,
       'departure_time_Night': False,'arrival_time_Afternoon': False,
       'arrival_time_Early_Morning': False,'arrival_time_Evening': False,
       'arrival_time_Late_Night': False,'arrival_time_Morning': False,'arrival_time_Night': False,
       'destination_city_Bangalore': False,'destination_city_Chennai': False,
       'destination_city_Delhi': False,'destination_city_Hyderabad': False,
       'destination_city_Kolkata': False,'destination_city_Mumbai': False,
}

@app.post("/predict")
def predict(data: PredictionInput):
    source_city_key = f"source_city_{data.source_city.value}"
    destination_city_key = f"destination_city_{data.destination_city.value}"

    arrival_time_key = f"arrival_time_{data.arrival_time.value}"
    departure_time_key = f"departure_time_{data.departure_time.value}"

    ready_data = pred_table
    ready_data["is_direct"] = data.is_direct
    ready_data["duration"] = data.duration
    ready_data["days_left"] = data.days_left

    ready_data[arrival_time_key] = True
    ready_data[departure_time_key] = True
    ready_data[destination_city_key] = True
    ready_data[source_city_key] = True

    model: RandomForestRegressor = joblib.load("src/random_forest.pkl")
    scaler: StandardScaler = joblib.load("src/scaler.pkl")
    x = np.array(list(ready_data.values())).reshape(1, -1)

    prediction = model.predict(x).reshape(1,-1)
    return {"predicted_price": (scaler.inverse_transform(prediction)[0][0])}