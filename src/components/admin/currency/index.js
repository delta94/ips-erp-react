import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Card, Input, Message } from "element-react";
import { GetCurrencyAPI } from "../../../api";

const AdminCurrency = props => {
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    GetCurrencyAPI()
      .then(res => {
        res.data.forEach(element => {
          element.edit = false;
        });
        setCurrencies(res.data);
      })
      .catch(err => console.log(err));
  }, []);
  const columns = [
    {
      type: "index",
    },
    {
      label: "货币",
      prop: "name",
      width: 150,
    },
    {
      label: "汇率",
      prop: "rate",
      width: 160,
      render: function (data) {
        if (!data.edit) {
          return <Tag>{data.rate}</Tag>;
        } else {
          return (
            <Input
              value={data.rate}
              onChange={e => {
                let index = currencies.findIndex(s => s.id === data.id);
                data.rate = e;
                currencies[index] = data;
                setCurrencies([...currencies]);
              }}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  let index = currencies.findIndex(s => s.id === data.id);
                  data.edit = false;
                  currencies[index] = data;
                  setCurrencies([...currencies]);
                }
              }}
            />
          );
        }
      },
    },
    {
      label: "操作",
      prop: "address",
      render: function (data) {
        return (
          <span>
            <Button
              plain={true}
              type="info"
              size="small"
              onClick={() => {
                let index = currencies.findIndex(s => s.id === data.id);
                data.edit = true;
                currencies[index] = data;
                setCurrencies([...currencies]);
              }}
            >
              编辑
            </Button>
            <Button type="danger" size="small">
              删除
            </Button>
          </span>
        );
      },
    },
  ];

  return (
    <Card className="box-card">
      <Table
        style={{ width: "100%" }}
        columns={columns}
        data={currencies}
        border={true}
        // height={250}
        highlightCurrentRow={true}
        // onCurrentChange={item => {
        //   console.log(item);
        // }}
      />
    </Card>
  );
};

export default AdminCurrency;
