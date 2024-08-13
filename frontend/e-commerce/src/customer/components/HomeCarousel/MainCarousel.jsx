import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { dataTest } from './dataTest';
const items = dataTest.map((item,index)=> <img className='cursor-pointer' src={item.image} alt="" key={index}/>)

const MainCarousel = () => (
    <AliceCarousel
        mouseTracking
        items={items}
        controlsStrategy="alternate"
        autoPlay
        autoPlayInterval={2500}
        disableButtonsControls
        infinite
        disableDotsControls
    />
);
export default MainCarousel