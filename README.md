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

1. **Product Listing and Details:**
   - Users can browse a catalog of products, view details such as name, price, and description, and navigate to individual product pages.

2. **User Authentication:**
   - Authentication is implemented using Next-auth, allowing users to sign up, log in, and manage their accounts securely.
   - Only authenticated users can access certain features like adding items to the cart and checking out.

3. **Cart Management:**
   - Users can add products to their cart, update quantities, and remove items as needed.
   - Cart information is stored in the browser's cookies using JS-cookie, ensuring persistence across sessions.

4. **Checkout Process:**
   - A streamlined checkout process is implemented, allowing users to review their cart, enter shipping and payment information, and place orders.
   - Formik is used for form management, providing a simple and intuitive way to handle form validation and submission.

5. **Real-time Feedback with Toastify:**
   - Toastify is integrated to provide real-time feedback to users, such as success messages after adding items to the cart or error messages during the checkout process.

6. **UI Enhancements with React-icons:**
   - React-icons are used to enhance the user interface with a variety of iconography, improving visual appeal and usability.

7. **Data Validation with Yup:**
   - Yup is employed for client-side data validation, ensuring that user input is accurate and meets specified criteria before submission.

8. **Backend Integration with Mongoose and Axios:**
   - Mongoose is used to model and interact with the MongoDB database, handling tasks such as storing product data, user profiles, and orders.
   - Axios facilitates communication with external APIs or backend services, allowing seamless integration with payment gateways or shipping providers.

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

* Github
* Vercel
* Mongo DB Atlas
* PayPal
* Cloudinary

## Getting started

* Dependency
  - Formik
  - JS-cookie
  - Typescript
  - Toastfy
  - React-icons
  - YUP
  - Mongoose
  - Next-auth
  - Axios
  
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
    vituhonorato.89@gmail.com directly instead of using issue tracker. We value your effort
    to improve the security and privacy of this project!

  ## Versioning

  2.0.0.0


  ## Authors

  * **@jvmhonorato** 

  Please follow github and join us!
  Thanks to visiting me and good coding!
