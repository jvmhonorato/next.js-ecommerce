<div align="center">

## 🚀 Next.js E-commerce Model

<p>
  <img alt="TypeScript" height="50" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" />
  <img alt="Next.js" height="50" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" />
  <img alt="React" height="50" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" />
  <img alt="Node.js" height="50" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain.svg" />
  <img alt="MongoDB" height="50" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-plain.svg" />
  <img alt="Cloudinary" height="50" src="https://res.cloudinary.com/diypdepuw/image/upload/v1699044264/cloudinary_ckujxh.png" />
  <img alt="TailwindCSS" height="50" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" />
  <img alt="Jest" height="50" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" />
</p>

<p>
  A modern, scalable and production-ready e-commerce template built with Next.js.
</p>

🔗 **Live Demo:** https://outfit-store-alpha.vercel.app/

</div>




## Overview

The Next.js E-commerce Model with is a fully functional e-commerce application model built with Next.js, Formik, and several other libraries and technologies. It provides developers with a solid foundation to kickstart the development of their e-commerce projects.

## Features

##  Overview

This project is a fully functional **E-commerce application model** built with modern technologies like **Next.js, TypeScript, MongoDB and NextAuth**.

It provides a solid foundation for developers who want to quickly build scalable and production-ready online stores.

---

##  Features

###  Product Catalog
- Browse products with detailed pages
- View price, description and images
- Clean and responsive UI

###  Authentication
- Secure authentication with **NextAuth**
- User login & registration
- Protected routes (cart & checkout)

###  Cart Management
- Add / remove products
- Update quantities
- Persistent cart using cookies

### Checkout Flow
- Complete checkout experience
- Form validation with **Formik + Yup**
- Shipping & payment steps

###  Notifications
- Real-time feedback using **Toastify**
- Success and error alerts

###  UI/UX Enhancements
- Icons with **React Icons**
- Styled with **TailwindCSS**

###  Backend & API
- MongoDB with **Mongoose**
- API communication with **Axios**

---


## Usage

1. **Development Environment Setup:**
   - Clone the repository and install dependencies using npm or yarn.
   - Configure environment variables for Next-auth, MongoDB connection, and any other required services.

2. **Customization and Extension:**
   - Customize the UI components, styles, and functionality to match the specific requirements of your e-commerce project.
   - Extend the model by adding features like product reviews, wishlists, or promotional banners.

3. **Testing and Deployment:**
   - Test the application thoroughly to ensure functionality and performance.
   - Deploy the application to your preferred hosting platform, configuring deployment settings as necessary.



</div>



## Services Used
| Frontend       | Backend        | Tools & Services |
|----------------|---------------|------------------|
| Next.js        | Node.js       | Vercel           |
| React          | MongoDB       | GitHub           |
| TypeScript     | Mongoose      | Cloudinary       |
| TailwindCSS    | NextAuth      | PayPal           |
| Formik + Yup   | API Routes    |                  |

  
* To install the dependencies.
```bash
  $ npm install
  ```
  
* To run the project.
```bash
  $ npm run dev
  ```

* To seed on data base
```
import Product from "@/models/Product";
import User from "@/models/User";
import data from "@/utils/data";
import db from "../../utils/db"

const handler = async (req:any, res:any) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send({message: 'seeded successfully'})

};
export default handler;
```







## Conclusion

The Next.js E-commerce Model with Formik offers a comprehensive and scalable solution for building e-commerce applications. With its robust authentication, cart management, checkout process, and integration with various libraries and technologies, it provides developers with a solid foundation to create feature-rich and user-friendly online stores.


## Links
  - Deploy on Vercel: Soon 
  - Repository: https://github.com/jvmhonorato/outfit-store
  - In case of sensitive bugs like security vulnerabilities, please contact
    honorato.ofc@gmail.com directly instead of using issue tracker. We value your effort
    to improve the security and privacy of this project!

  ## Versioning

  2.0.0.0


  ## Authors

  * **@jvmhonorato** 

  Please follow github and join us!
  Thanks to visiting me and good coding!
