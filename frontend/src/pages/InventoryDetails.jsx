import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const InventoryDetails = () => {
    const { itemId } = useParams();
    const [itemDetails, setItemDetails] = useState(null);

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:8800/api/inventory/details/${itemId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setItemDetails(response.data);
            } catch (error) {
                console.error("❌ Error fetching item details:", error);
            }
        };

        if (itemId) fetchItemDetails();
    }, [itemId]);

    if (!itemDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="inventory-details-container">
            <h2>Item Details</h2>
            <p><strong>Item Name:</strong> {itemDetails.i_name}</p>
            <p><strong>Item ID:</strong> {itemDetails.item_id}</p>
            <p><strong>Category:</strong> {itemDetails.category}</p>
            <p><strong>Quantity:</strong> {itemDetails.quantity}</p>
            <p><strong>Condition:</strong> {itemDetails.status}</p>
            <p><strong>Last Maintenance:</strong> {itemDetails.last_maintenance_date}</p>
            {/* Display other details here */}
        </div>
    );
};

export default InventoryDetails;
