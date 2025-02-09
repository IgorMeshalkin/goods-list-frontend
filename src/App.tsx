import {Route, Routes} from "react-router-dom";
import CommonLayoutComponent from "./components/common_layout/common_layout.component";
import GoodsListComponent from "./components/goods_list/goods_list.component";
import GoodDetailsComponent from "./components/good_details/good_details.component";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<CommonLayoutComponent />}>
                <Route index element={<GoodsListComponent />} />
                <Route path="/good/:uuid" element={<GoodDetailsComponent/>} />
            </Route>
        </Routes>
    );
};

export default App;