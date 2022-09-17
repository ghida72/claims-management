import ItemDetails from "./ItemDetails";
import Drawer from "../layout/Drawer";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

/*
The ItemDetailsWrapper component is introduced in order to pass a key to the ItemDetails that 
indicates to React that this is another instance of the component whenever we navigate to the 
route of another CPT (line item) and consequently update the DOM to reflect the data of the latter. That
was not possible while defining the route in App.js.
*/
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
