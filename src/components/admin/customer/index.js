import React from "react";
import { Table, Icon, Tag, Button } from "element-react";

const AdminCustomer = props => {
  const columns = [
    {
      type: "index",
    },
    {
      label: "日期",
      prop: "date",
      width: 150,
      render: function (data) {
        return (
          <span>
            <Icon name="time" />
            <span style={{ marginLeft: "10px" }}>{data.date}</span>
          </span>
        );
      },
    },
    {
      label: "姓名",
      prop: "name",
      width: 160,
      render: function (data) {
        return <Tag>{data.name}</Tag>;
      },
    },
    {
      label: "操作",
      prop: "address",
      render: function () {
        return (
          <span>
            <Button plain={true} type="info" size="small">
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
  const data = [
    {
      date: "2016-05-02",
      name: "王小虎",
      province: "上海",
      city: "普陀区",
      address: "上海市普陀区金沙江路 1518 弄",
      zip: 200333,
    },
    {
      date: "2016-05-02",
      name: "王小虎",
      province: "上海",
      city: "普陀区",
      address: "上海市普陀区金沙江路 1518 弄",
      zip: 200333,
    },
    {
      date: "2016-05-02",
      name: "王小虎",
      province: "上海",
      city: "普陀区",
      address: "上海市普陀区金沙江路 1518 弄",
      zip: 200333,
    },
    {
      date: "2016-05-02",
      name: "王小虎",
      province: "上海",
      city: "普陀区",
      address: "上海市普陀区金沙江路 1518 弄",
      zip: 200333,
    },
    {
      date: "2016-05-02",
      name: "王小虎",
      province: "上海",
      city: "普陀区",
      address: "上海市普陀区金沙江路 1518 弄",
      zip: 200333,
    },
    {
      date: "2016-05-02",
      name: "王小虎",
      province: "上海",
      city: "普陀区",
      address: "上海市普陀区金沙江路 1518 弄",
      zip: 200333,
    },
    {
      date: "2016-05-02",
      name: "王小虎",
      province: "上海",
      city: "普陀区",
      address: "上海市普陀区金沙江路 1518 弄",
      zip: 200333,
    },
  ];

  return (
    <Table
      style={{ width: "100%" }}
      columns={columns}
      data={data}
      border={true}
      // height={250}
      highlightCurrentRow={true}
      onCurrentChange={item => {
        console.log(item);
      }}
    />
  );
};

export default AdminCustomer;
