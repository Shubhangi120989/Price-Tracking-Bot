import requests
from bs4 import BeautifulSoup

def get_amazon_product_details(url):
    # Define headers to mimic a browser visit
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }

    # Send a GET request to fetch the page content
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Failed to retrieve the page. Status code: {response.status_code}")

    # Parse the page content
    soup = BeautifulSoup(response.content, "html.parser")

    # Find the price element
    price = None
    price_element = soup.find("span", {"class": "a-price-whole"})
    if price_element:
        price_fraction = soup.find("span", {"class": "a-price-fraction"})
        if price_fraction:
            price = f"{price_element.text.strip()}{price_fraction.text.strip()}"
        else:
            price = price_element.text.strip()

    # Adjust price if it ends with "00"
    # if price and price.endswith("00"):
        # price = price[:-2]

    # Find the product title element
    title_element = soup.find("span", {"id": "productTitle"})
    product_name = title_element.text.strip() if title_element else "No title found"

    if not price:
        raise Exception("Could not find the price on the page.")

    # Return both product name and price in a dictionary
    return {"product_name": product_name, "price": price}


# Test the function with the provided URL
url = "https://www.amazon.in/Estele-Jewellery-Dangling-Women-702-ER/dp/B08CQ6HJCF/ref=sr_1_1_sspa?sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1"
url2='https://www.amazon.in/HighSpark-Solitaire-Swarovski-Earrings-Brilliance/dp/B08R2NFG9T/ref=sr_1_3_sspa?sr=8-3-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1'
url3='https://www.amazon.in/dp/B08JHZPSWK/?_encoding=UTF8&ref_=sbx_be_s_sparkle_ssd_img&pd_rd_plhdr=t'
url4='https://www.amazon.in/Hawkins-Tri-ply-Stainless-Steel-Deep-Fry/dp/B07Z3R64MK/?_encoding=UTF8&ref_=pd_hp_d_atf_dealz_m2'
try:
    # print("Price:", get_amazon_price(url))
    # print(get_amazon_price(url2))
    print(get_amazon_product_details(url4))
except Exception as e:
    print("Error:", e)
