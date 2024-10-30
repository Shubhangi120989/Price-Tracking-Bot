import axios from "axios";
import cheerio from "cheerio";

export async function getAmazonProductDetails(url) {
    try {
        // Define headers to mimic a browser visit
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9"
        };

        // Send a GET request to fetch the page content
        const response = await axios.get(url, { headers });
        const html = response.data;

        // Parse the HTML content using Cheerio
        const $ = cheerio.load(html);

        // Find the product title element
        const productName = $("#productTitle").text().trim() || "No title found";

        // Find the price element
        let priceWhole = $(".a-price-whole").first().text().trim();
        let priceFraction = $(".a-price-fraction").first().text().trim();
        let price = priceWhole + priceFraction;

        // Handle cases where the price might not be found
        if (!price) {
            throw new Error("Could not find the price on the page.");
        }

        // Return both product name and price in an object
        return { product_name: productName, price: price };

    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Test the function with a URL
// const url = "https://www.amazon.in/Estele-Jewellery-Dangling-Women-702-ER/dp/B08CQ6HJCF/ref=sr_1_1_sspa?sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1";
// const url2 = "https://www.amazon.in/HighSpark-Solitaire-Swarovski-Earrings-Brilliance/dp/B08R2NFG9T/ref=sr_1_3_sspa?sr=8-3-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1";
// const url3 = "https://www.amazon.in/dp/B08JHZPSWK/?_encoding=UTF8&ref_=sbx_be_s_sparkle_ssd_img&pd_rd_plhdr=t";
// const url4 = "https://www.amazon.in/Hawkins-Tri-ply-Stainless-Steel-Deep-Fry/dp/B07Z3R64MK/?_encoding=UTF8&ref_=pd_hp_d_atf_dealz_m2";
const url5="https://www.amazon.in/Zaveri-Pearls-Earrings-Multicolor-ZPFK1194/dp/B00QYQ38J4/ref=sr_1_5?sr=8-5"
// // Testing with one of the URLs
getAmazonProductDetails(url5).then(details => console.log(details));

