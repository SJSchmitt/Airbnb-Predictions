# import dependencies
import pandas as pd
from sqlalchemy import create_engine
import psycopg2
from config import db_password

def preprocessing(season):
    db_string = f"postgresql://postgres:{db_password}@127.0.0.1:5432/AirBNB_Data"
    engine = create_engine(db_string)
    
    table_name = f'airbnb_{season}_ml'
    ml_df = pd.read_sql_table(table_name, con=engine)
    ml_df = ml_df.drop('index', axis=1)
    
    # price is target (y), everything else is independent (X)
    X = ml_df.drop('price', axis = 1)
    y = ml_df['price']

    # neighbourhoods_cleansed has too many unique values (103 in fall), but binning is difficult
    # if we bin all neighbourhoods with <100 units as 'Other', we still have 37 unique values and the 'other' group
    # has over 2000 of our units (the next highest has 1975, then 953)
    # I worry that if we group them too much, it defeats the meaning of having a neighbourhood column
    # since we have lat and long data, I think we should use that instead and drop neighbourhood_cleansed - Sam
    X = X.drop('neighbourhood_cleansed', axis=1)

    # four room_types, so no need to bin those
    # 78 property_types
    prop_types = ml_df.property_type.value_counts()

    # bin property_type if less than 300 examples, for 10 columns with Entire home, Entire rental unit, and Entire condo 
    # categories more populous than Other
    replace_prop = list(prop_types[prop_types < 300].index)

    # Replace in dataframe
    for prop in replace_prop:
        X.property_type = X.property_type.replace(prop,"Other")

    # convert categorical room_type and property_type to dummy columns
    X = pd.get_dummies(X, columns = ['room_type', 'property_type'], prefix = ['room', 'property'])
    
    # return X and y
    return X, y