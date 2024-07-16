import { Button, Col, Form, Input, Row, Select } from "antd";
import { useState } from "react";
import { createClient } from "../utility/Rest";

const { Option } = Select;

function CreateClientPage({ handleCancel, fetchData, attributes }) {
  const [clientData, setClientData] = useState(
    attributes.reduce((acc, attr) => {
      console.log("attributes", attributes);
      acc[attr.name] = "";
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value,
    });
  };

  const handleEnumChange = (name, value) => {
    setClientData({
      ...clientData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      console.log("clientData: ", clientData);
      await createClient(clientData);
      fetchData();
      handleCancel();
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  return (
    <Form
      onFinish={handleSubmit}
      layout="vertical"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      {attributes.map((attr) => {
        if (attr.name === "ClientId") return null;

        switch (attr.type) {
          case "String":
            return (
              <Form.Item key={attr.name} label={attr.name} required>
                <Input
                  type="text"
                  name={attr.name}
                  value={clientData[attr.name]}
                  onChange={handleChange}
                  required
                />
              </Form.Item>
            );
          case "Enum":
            return (
              <Form.Item key={attr.name} label={attr.name} required>
                <Select
                  name={attr.name}
                  value={clientData[attr.name]}
                  onChange={(value) => handleEnumChange(attr.name, value)}
                  required
                >
                  <Option value={attr.name[0]}>{attr[0]}</Option>
                  <Option value="Married">Married</Option>
                </Select>
              </Form.Item>
            );
          default:
            return null;
        }
      })}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default CreateClientPage;
