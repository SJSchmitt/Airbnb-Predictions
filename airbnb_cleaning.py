import pandas as pd
import numpy as np

def clean_df(file_path):

    # read csv to dataframe

    full_df = pd.read_csv(file_path, compression='gzip')

    # select columns we're interested in for ml model and dashboard

    analysis_df = full_df[["price","neighbourhood_cleansed","room_type","accommodates","longitude","latitude","beds","bedrooms",

        "property_type","bathrooms_text","review_scores_rating", "review_scores_accuracy", "review_scores_cleanliness", 

        "review_scores_checkin", "review_scores_communication", "review_scores_location", "review_scores_value", "license", "host_name"]]

    # process NaNs

    # drop nan beds and bathrooms_text

    analysis_df.dropna(subset = ['beds', 'bathrooms_text'], inplace = True)


    # replace NaNs with values based on columns.  Average ratings for review_scores to 2 dec places,

    # text for host_name and license

    values = {"host_name":"No Host Listed", 

              "review_scores_rating": round(analysis_df['review_scores_rating'].mean(), 2), 

              "review_scores_accuracy": round(analysis_df['review_scores_accuracy'].mean(), 2),

              "review_scores_cleanliness": round(analysis_df['review_scores_cleanliness'].mean(), 2),

              "review_scores_checkin": round(analysis_df['review_scores_checkin'].mean(), 2),

              "review_scores_communication": round(analysis_df['review_scores_communication'].mean(), 2),

              "review_scores_location": round(analysis_df['review_scores_location'].mean(), 2),

              "review_scores_value": round(analysis_df['review_scores_value'].mean(), 2),

              "bedrooms": analysis_df.loc[full_df['bedrooms'].isna()]['beds'],

              "license": "No License"}

    analysis_df = analysis_df.fillna(value = values)


    # convert price to float

    analysis_df['price'] = analysis_df['price'].str.replace('$', '')

    analysis_df['price'] = analysis_df['price'].str.replace(',', '').astype(float)


    # convert bathrooms_text to float

    analysis_df['bathrooms_text'] = analysis_df['bathrooms_text'].str.split(n=1, expand=True)[0]

    # all bathroom_text values without a number are half baths, verified with value_counts() function

    # all text values contain the letter a, other values are purely numeric at this point

    analysis_df.loc[analysis_df['bathrooms_text'].str.contains('a'), 'bathrooms_text'] = 0.5


    # rename bathrooms_text as bathrooms

    analysis_df['bathrooms'] = analysis_df['bathrooms_text'].astype(float)

    analysis_df.drop(['bathrooms_text'], axis = 1, inplace = True)


    return analysis_df

    