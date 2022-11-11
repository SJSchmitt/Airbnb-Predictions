
# Predicting Airbnb prices in San Diego using Machine Learning 
![My Image](Resources/San_Diego_skyline.jpeg)

# Project Background

Airbnb is a housing platform used by people around the world, be it home-owners, renters, or customers looking for living accomodations. The platform has been in the news a lot recently regarding their pricing and whether or not it is sustainable long-term. Airbnb expects hosts to set their own prices, and there are not many (if any) free services that provide accurate pricing for people looking to rent out their place.

Pricing is important, especially as decline has decreased over the past couple of years due to COVID and other risk factors preventing people from vacationing. People looking to put their property on the site need to be carfeful what price they set. Too low means not maximising earning potential, and too high means people are less likely to book.

Our project aims to identify key variables in Airbnb data and use our machine learning model to predict, as accurately as we can, the daily rent price a property should be listed at in San Diego.

# Team Dynamics
 
Our primary communication is in class on Tuesdays and Thursdays and on slack throughout the week.

# Data Source

The dataset used for this project came from insideairbnb.com, a site consisting of a group of collaborators who scrub Airbnb listings, neighborhoods, and reviews from cities all over the world. For the purposes of this project, we are using quarterly data from the last 12 months to provide a complete overview of the city across an entire year. The data we gathered puts the number of Airbnbs currently listed on the platform at about 14,000.

# What should listing price be for new rentals in San Diego?

* Using supervised machine learning classification model to group prices based on location. 
* Which neighborhoods have highest vs lowest prices.
* Listings per neighborhood.
* Good vs bad reviews.
* Seasonality of rentals. Do prices change per season?
* House amenities.
* Merge all four data sets and have a column for season.
* Can use muiltple visulizations from both the prediction model and basic analysis(similar to tableau model). check out pair plots. map plots in tableau.


# Limitations on Data

* Cleaning data is needed since the source has a lot of columns that contain text and boleans.
* The columns for reviews have a disproportionate number of "Nan" which would requires us to calculate the mean and populate.
* The price an Airbnb sells for can be dynamic, and unfortunately the data only shows the listing price at the timne of scraping. This means we do not have data on the price the customer actually paid.
* The data is subdivided into seperate seasonal datasets, which makes the interpretation difficult.


# Exploration of the Data

We next undertook an exploratory analysis of the data in a visual manner. The main questions we seek to answer were related to pricing, listings, and reviews, so our visual exploration of the data was centered around showcasing how location, namely by neighborhood, can have an effect on the overall price. 

Below gives a map view on where the top 10 neighbourhoods by listings are. The vast majority of listings are located close to the beach

![My Image](Resources/Listings_Neightbourhood.PNG)


One thing that struck us from the data is that the priciest neighbourhood listings are not neccessarily the best rated, as shown in the two figures below.


![My Image](Resources/Highest_Avg_Price.PNG)



![My Image](Resources/Best_Rated_Neighbourhoods.PNG)


This observation is also true for the inverse of the data, as the cheapest neighborhoods are not necessarily the worst rated.


![My Image](Resources/Lowest_Average_Price.PNG)


![My Image](Resources/Worst_Rated.PNG)

Another area of importance is the type of property, as shown in the tree map below. As you would expect, entire houses, apartments, and condos represent the highest percentage of overall units, but there are plenty of other options available (you can even rent an RV or bungalow).

![My Image](Resources/PropertyTypes.PNG)

When we dive closer to the percentages with regards to the type of rooms availabe, almost 80% of listings are either a home or an apartment which tells us that there are a number of individuals who list their own personal property on AirBnb.

![My Image](Resources/Percentage_Room_types.PNG)

As we dove deeper into the data and started integrating our database into the machine learning model, the main thing we wanted to visualize was the impact each column had on the overall result of the model. Below you will see the results:

![My Image](Resources/Feature_Importances.PNG)

# Story Board

Below is the link to the story board we created on google slides
https://docs.google.com/presentation/d/15oewejHwX402getnFd6vY7tPsE8IjyhiXCyFo9Xzf2I/edit?usp=sharing

# Database Integration

Our data is stored in Postgres and we use functions to push csv data to SQL tables and access them in a pandas dataframe. This is demonstrated in the airbnb_toSQL and preprocessing files in the src and helpers folders. Tables for each season can be accessed by calling the preprocessing function and passing the season within the perentheses. We called it in our machine learning model to access the tables and create our features.



    
