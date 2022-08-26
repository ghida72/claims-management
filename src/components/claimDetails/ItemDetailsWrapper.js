import { useParams } from "react-router-dom";
import ItemDetails from "./ItemDetails";
import Drawer from "../layout/Drawer";
import { useOutletContext } from "react-router-dom";

const ItemDetailsWrapper = () => {
  const [claim] = useOutletContext();
  const params = useParams();
  const { itemCPT } = params;

  return (
    <Drawer pathname={`/claims/${claim.claimNumber}`}>
      <ItemDetails key={itemCPT} />
    </Drawer>
  );
};

export default ItemDetailsWrapper;
