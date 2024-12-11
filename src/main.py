import joblib

from enum import Enum

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
    EARLY_MORNING = 'Early_Morning'
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
    departure_city = f"source_city_{data.source_city}"
    arrival_city = f"destination_city_{data.destination_city}"

    model: RandomForestRegressor = joblib.load("random_forest.pkl")
    scaler: StandardScaler = joblib.load("scaler.pkl")
    return scaler.inverse_transform(model.predict(x).reshape(1,-1))
