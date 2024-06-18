import { useEffect, useState } from 'react';

const KeepaDataList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getKeepaData();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <ul>
      {data.map((item, index) => (
        <li key={index}>
          <p>ASIN: {item.asin}</p>
          <p>Country Code: {item.countryCode}</p>
          <p>Brand: {item.brand}</p>
          <p>Product Name: {item.productName}</p>
          <p>URL Image: {item.urlImage}</p>
          <p>EAN: {item.ean}</p>
          <p>Product Category Id: {item.productCategoryId}</p>
          <p>Sales Ranking 30 Days Avg: {item.salesRanking30DaysAvg}</p>
          // Add the missing fields here
        </li>
      ))}
    </ul>
  );
};

export default KeepaDataList;
