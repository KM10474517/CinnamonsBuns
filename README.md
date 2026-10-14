# Cinnamon's Buns: Bakery Website

A multi-page website for a bakery called Cinnamon's Buns, with a product gallery, a shop with a working shopping cart, and a contact page with a map. It uses plain HTML, CSS and JavaScript, with no frameworks.

## Features

### Pages
- **Home (`index.html`):** hero section, best-selling items, quick contact details and a search bar
- **About (`about.html`):** the bakery's story and mission, trading hours and location
- **Gallery (`gallery.html`):** a photo showcase of baked goods, including items not yet in the shop
- **Shop (`shop.html`):** the full product list with images, names, prices and Add-to-Cart buttons
- **Contact (`contact.html`):** contact form, phone and email details, business hours and an interactive map

### Shopping cart
- Add items, change quantities, remove items or clear the whole cart
- Cart count and running total update live
- The cart is saved with `localStorage`, so it persists between visits

### Search
- Filters shop products by name as you type

## Tech Stack

- HTML5
- CSS3
- JavaScript (vanilla)
- [Remix Icon](https://remixicon.com/)
- [Leaflet](https://leafletjs.com/) for the map
- Google Fonts

## Getting Started

1. Clone the repo:
   ```
   git clone https://github.com/KM10474517/CinnamonsBuns.git
   ```
2. Open the folder.
3. Open `index.html` in any browser.

## Project Structure

```
CinnamonsBuns/
├── index.html
├── about.html
├── gallery.html
├── shop.html
├── contact.html
├── CSS/
│   └── style.css
├── JavaScript/
│   └── script.js
└── Images/
```

## Current Limitations and Next Steps

This is currently a front-end site. Ordering and the contact form are not connected to a server yet. A planned next step is a back end with a database to store products and orders.

## Author

Website developed by **Kamohelo Mopeli**. Icons by Remix Icon.
