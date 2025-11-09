# Restaurant Menu & Billing System

A simple, feature-rich restaurant website with menu management, shopping cart, billing, and sales reporting.

## Features

### Customer Features
- **Menu Display**: Browse menu items with images, prices, and descriptions
- **Shopping Cart**: Add items to cart, adjust quantities, and view total
- **Billing**: Generate invoices with itemized list and tax calculation
- **Payment**: QR code payment integration
- **Print Bill**: Print invoices for records

### Manager Features
- **Menu CRUD**: Create, Read, Update, and Delete menu items
- **Sales Reports**: Monthly sales reports with:
  - Total revenue
  - Number of orders
  - Top selling items
  - Daily sales breakdown
- **Invoice History**: View all past invoices

## Setup Instructions

1. **Clone or download** this repository

2. **Add Menu Images**:
   - Place menu item images in the `images/` folder
   - Required images: `idly.jpg`, `poori.jpg`, `dosa.jpg`, `vada.jpg`, `samosa.jpg`
   - See `images/README.md` for details

3. **Open the Website**:
   - Simply open `index.html` in a web browser
   - No server or build process required!

4. **Default Menu Items**:
   - The app comes pre-loaded with 5 items: Idly, Poori, Dosa, Vada, and Samosa
   - You can modify or add more items through the Manager menu

## Usage

### For Customers
1. Browse the menu on the main page
2. Click "Add to Cart" on any item
3. View cart by clicking the "Cart" button in the header
4. Adjust quantities or remove items
5. Click "Checkout" to generate an invoice
6. Click "Pay" to see payment QR code
7. Click "Print Bill" to print the invoice

### For Managers
1. Click "Manager" button in the header
2. **Menu Management Tab**:
   - Add new menu items with "+ Add Menu Item"
   - Edit existing items
   - Delete items
3. **Sales Report Tab**:
   - Select month and year
   - Click "Generate Report" to view sales statistics
4. **Invoice History Tab**:
   - View all completed invoices

## Technology Stack

- **HTML5**: Structure and layout
- **CSS3**: Styling with modern design and responsive layout
- **JavaScript (Vanilla)**: All functionality without frameworks
- **localStorage**: Data persistence (no backend required)
- **QRCode.js**: QR code generation for payments (CDN)

## Data Storage

All data is stored in browser localStorage:
- `restaurantMenu`: Menu items
- `shoppingCart`: Current cart items
- `invoices`: Completed invoices for reports

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Customization

### Adding Tax
Currently set to 5% tax. To change, modify the `tax` calculation in the `generateInvoice()` function in `script.js`.

### Changing Colors
Modify the CSS variables and color values in `styles.css` to match your brand.

### Adding More Features
The code is well-structured and easy to extend. All functions are clearly named and organized.

## Notes

- Images are optional - the app will show placeholders if images are missing
- All data is stored locally in your browser
- No internet connection required (except for QR code library CDN)
- Mobile-responsive design works on all devices

## License

Free to use and modify for your restaurant.

