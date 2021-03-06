import React, { useEffect, useState } from "react";
import styles from "./css/favourites.module.css";
import { useHistory } from "react-router-dom";
import {
  ArrowBackIcon,
  DeleteIcon,
  PlusSquareIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import {
  SimpleGrid,
  IconButton,
  Image,
  Button,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import Placeholder from "../../assets/placeholder.png";
import CartIconFilled from "../../assets/cart-filled.svg";
import { getStoreDataByIdAPI } from "../../api/custStoreAPI";
import useStore from "../../cartState";

const StoreCart = (props) => {
  const history = useHistory();
  const [productsData, setProductsData] = useState([]);
  const [isProducts, setIsProducts] = useState(true);
  const [userInfo, setUserInfo] = useState({});

  const cartProducts = useStore((state) => state.products);
  const deleteCartProduct = useStore((state) => state.deleteProduct);
  const addCartQuantity = useStore((state) => state.addQuantity);
  const removeCartQuantity = useStore((state) => state.removeQuantity);

  let storeId = props.match.params.store_id;

  // get store details from server
  useEffect(() => {
    const getStoreDetails = async () => {
      const response = await getStoreDataByIdAPI(storeId);
      console.log(response);
      setUserInfo(response.data.data);
    };
    getStoreDetails();
  }, []);

  const whatsappBuy = async () => {
    const productsMsg = cartProducts.map(
      (item) =>
        `• ${item.product_name} ${
          item.product_variant && `(${item.product_variant.variant_name})`
        }   x   ${item.product_quantity} - ₹${
          item.product_quantity * item.product_price
        }%0D%0A `
    );
    const whatsappMessage = `Hey👋 %0D%0AI want to place an order %0D%0A%0D%0A*Order*%0D%0A${productsMsg.join(
      ""
    )}%0D%0A Total: ₹${cartProducts.reduce(
      (acc, curr) => acc + curr.product_quantity * curr.product_price,
      0
    )}%0D%0A_______________________%0D%0A%0D%0A Powered by Saav.in`;
    window.location.replace(
      `https://api.whatsapp.com/send/?phone=91${userInfo.account_whatsapp}&text=${whatsappMessage}`
    );
  };

  //check if current store has any favourates saved by user

  return (
    <div className={styles.container}>
      <IconButton
        backgroundColor="#f8f9fd"
        borderRadius="30px"
        aria-label="Search database"
        icon={<ArrowBackIcon color="black" w={8} h={8} />}
        pos="fixed"
        top="3"
        left="3"
        onClick={() => history.goBack()}
      />
      <h1 className={styles.heading}>Cart</h1>
      <Flex flexDirection="column" w="95%">
        {cartProducts.length > 0 ? (
          cartProducts.map((product) => {
            return (
              <>
                <div className={styles.product_item} key={product.product_id}>
                  <IconButton
                    colorScheme="gray"
                    borderRadius="100%"
                    size="sm"
                    position="absolute"
                    right="8px"
                    top="8px"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCartProduct(product);
                    }}
                    icon={<DeleteIcon color="red.400" w={4} h={4} />}
                  />
                  <img
                    src={
                      product.product_image
                        ? `https://firebasestorage.googleapis.com/v0/b/saav-9c29f.appspot.com/o/product_images%2Fmin%2F${product.product_image}?alt=media`
                        : Placeholder
                    }
                    alt="img"
                    onClick={() =>
                      history.push(`/product_detail/${product.product_id}`)
                    }
                    className={styles.product_image}
                  />

                  <div className={styles.product_details}>
                    <h1
                      onClick={() =>
                        history.push(`/product_detail/${product.product_id}`)
                      }
                      className={styles.product_name}
                    >
                      {product.product_name}
                    </h1>
                    <h1 className={styles.product_price}>
                      ₹{product.product_price}
                    </h1>
                    <h1 className={styles.subheading}>
                      Variant: {product.product_variant.variant_name}
                    </h1>
                    <div className={styles.quantity_container}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCartQuantity(product);
                        }}
                        className={styles.small_circle}
                      >
                        -
                      </div>
                      <Text p="6px">{product.product_quantity}</Text>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          addCartQuantity(product);
                        }}
                        className={styles.small_circle}
                      >
                        +
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })
        ) : (
          <h1>No Products</h1>
        )}
        {/* product item ends here */}
      </Flex>
      {userInfo.account_whatsapp && (
        <Button
          mt="5"
          size="lg"
          colorScheme="green"
          w="90%"
          onClick={whatsappBuy}
          mb="10"
        >
          Place Order on Whatsapp
        </Button>
      )}
    </div>
  );
};

export default StoreCart;
