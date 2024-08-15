import { mens_kurta } from "../../../Data/mens_kurta";
import DialogHome from "../../components/DialogHome/DialogHome";
import Footer from "../../components/Footer/Footer";
import MainCarousel from "../../components/HomeCarousel/MainCarousel";
import HomeSectionList from "../../components/HomeSectionList/HomeSectionList";
import NewProductHomeSection from "../../components/NewProductHome/NewProductHomeSection";
import PolicyProductSection from "../../components/PolicyProduct/PolicyProductSection";

const HomePage = () => {
    return (
        <div>
            <DialogHome/>
            <MainCarousel/>
            <PolicyProductSection className="my-4 md:my-6 lg:my-8"/>
            <div className="container mx-auto pb-8 md:px-8 lg:px-20">
                <NewProductHomeSection/>
                <HomeSectionList data={mens_kurta} haveImage={true}/>
                <HomeSectionList data={mens_kurta} haveImage={true}/>
                <HomeSectionList data={mens_kurta} haveImage={true}/>
                <HomeSectionList data={mens_kurta} haveImage={true}/>
                <HomeSectionList data={mens_kurta} haveImage={true}/>
            </div>
        </div>

    )
}
export default HomePage