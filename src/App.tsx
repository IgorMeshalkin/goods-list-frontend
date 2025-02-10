import {Route, Routes} from "react-router-dom";
import CommonLayoutComponent from "./components/common_layout/common_layout.component";
import GoodsListPage from "./pages/goods_list/goods_list.page";
import GoodDetailsPage from "./pages/good_details/good_details.page";
import GoodFormPage from "./pages/good_form/good_form.page";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<CommonLayoutComponent />}>
                <Route index element={<GoodsListPage />} />
                <Route path="/good/:uuid" element={<GoodDetailsPage/>} />
                <Route path="/good/form" element={<GoodFormPage/>} />
            </Route>
        </Routes>
    );
};

export default App;