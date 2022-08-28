import ItemDetails from "./ItemDetails";
import Drawer from "../layout/Drawer";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const ItemDetailsWrapper = () => {
  const [claim] = useOutletContext();
  const params = useParams();
  const { itemCPT } = params;
  const navigate = useNavigate();

  const postCloseHandler = () => {
    navigate(`/claims/${claim.claimNumber}`);
  };

  return (
    <Drawer postCloseHandler={postCloseHandler}>
      <ItemDetails key={itemCPT} />
    </Drawer>
  );
};

export default ItemDetailsWrapper;
