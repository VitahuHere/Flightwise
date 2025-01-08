import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import joblib


def map_stops(x):
    if x == 'zero':
        return 0
    elif x == 'one':
        return 1
    else:
        return 2


def remove_outliers(df, column):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    return df[(df[column] > lower_bound) & (df[column] < upper_bound)].copy(deep=True)


data = pd.read_csv('Clean_Dataset.csv', index_col=0)
economy = data[data['class'] != 'Business'].copy(deep=True)
economy['stops'] = economy['stops'].apply(map_stops)

zero_or_one_stop = economy[economy['stops'] <= 1].copy(deep=True)

no_outliers = remove_outliers(zero_or_one_stop, 'price')
no_outliers = remove_outliers(no_outliers, 'duration')

trimmed = no_outliers.drop(columns=["airline", "flight", "class"]).copy(deep=True)
trimmed['stops'] = trimmed['stops'].apply(lambda x: True if x == 0 else False)
trimmed.rename(columns={'stops': 'is_direct'}, inplace=True)
trimmed['duration'] = trimmed['duration'].apply(lambda x: int(x * 60))

dummies = pd.get_dummies(trimmed)

X = dummies.drop(columns="price")
y = dummies["price"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)
y_train = scaler.fit_transform(y_train.values.reshape(-1, 1))
y_test = scaler.transform(y_test.values.reshape(-1, 1))

rf = RandomForestRegressor(n_estimators=200, n_jobs=-1)
y_train = y_train.ravel()
y_test = y_test.ravel()
rf.fit(X_train, y_train)

joblib.dump(rf, "random_forest.pkl")
joblib.dump(scaler, "scaler.pkl")