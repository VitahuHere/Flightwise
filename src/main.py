import fastapi
from enum import Enum
from pydantic import BaseModel, conint


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
