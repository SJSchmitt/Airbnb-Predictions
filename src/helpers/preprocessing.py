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

    # drop beds and bedrooms, as they have high colinearity with accommodates
    X = X.drop(['beds', 'bedrooms'], axis = 1)

    # neighbourhoods_cleansed has too many unique values (103 in fall), but binning is difficult
    # if we bin all neighbourhoods with <100 units as 'Other', we still have 37 unique values and the 'other' group
    # has over 2000 of our units (the next highest has 1975, then 953)
    # I worry that if we group them too much, it defeats the meaning of having a neighbourhood column
    # since we have lat and long data, I think we should use that instead and drop neighbourhood_cleansed - Sam
    X = X.drop('neighbourhood_cleansed', axis=1)

    # four room_types, so no need to bin those

    # 78 property_types
    # create a new list for renamed properties
    new_properties = []

    for prop in X.property_type:
        # replace property types containing 'Shared' with 'Shared room' to condense like values
        # no property_types contain the word 'Shared' if they aren't a shared room, specifically
        if "Shared" in prop:
            new_properties.append('Shared room')
        # same for private, no types contain 'Private' if not a private room in a different situation
        elif ("Private" in prop) or ("Room in" in prop):
            new_properties.append('Private room')
        elif "Entire" in prop:
            # entire units in a larger building/complex
            if ("condo" in prop) or ("rental unit" in prop) or ("guest suite" in prop) or ("loft" in prop) or ("apartment" in prop):
                new_properties.append('Entire Unit')
            # entire buildings, may or may not be on shared property (ie a guest house)
            else:
                new_properties.append('Entire Home')
        elif prop == "Tiny home":
            new_properties.append('Entire Home')
        elif ("Camper" in prop) or ("RV" in prop):
            new_properties.append('Camper/RV')
        else: 
            new_properties.append('Other')
    # overwrite property_type column with condensed list
    X['property_type'] = new_properties

    # convert categorical room_type and property_type to dummy columns
    X = pd.get_dummies(X, columns = ['room_type', 'property_type'], prefix = ['room', 'property'])
    
    # return X and y
    return X, y