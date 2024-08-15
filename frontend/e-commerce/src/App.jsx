
import Navigation from './customer/components/Navigation/Navigation'
import Product from './customer/components/Product/Product'
import HomePage from './customer/pages/HomePage/HomePage'
import Footer from './customer/components/Footer/Footer'
import HomeSectionList from './customer/components/HomeSectionList/HomeSectionList'
import { mens_kurta } from './Data/mens_kurta'
import ProductDetails from './customer/components/ProductDetails/ProductDetails'

function App() {

  return (
    <div className='App'>
      <Navigation/>
      <div>
        {/* <HomePage/> */}
        {/* <Product></Product> */}
        <ProductDetails/>
      </div>
      <Footer className="px-4 sm:px-6 lg:px-8"/>
    </div>
  )
}

export default App
