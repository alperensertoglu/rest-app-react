import { Button, Col, Form, Input, Row, Select } from "antd";
import { useState } from "react";
import { editClient } from "../utility/Rest";

const { Option } = Select;

function EditClientPage({ clientData, handleCancel, fetchData, attributes }) {
  const [clientValues, setClientValues] = useState(
    attributes.reduce((acc, attr) => {
      acc[attr.name] = clientData[attr.name] || "";
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientValues({
      ...clientValues,
      [name]: value,
    });
  };

  const handleEnumChange = (name, value) => {
    setClientValues({
      ...clientValues,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const { ClientId } = clientData;
    try {
      await editClient(ClientId, clientValues);
      fetchData();
      handleCancel();
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  return (
    <Form
      onFinish={handleSubmit}
      layout="vertical"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      {attributes.map((attr) => {
        if (attr.name === "ClientId") return null; // Skip ClientId

        switch (attr.type) {
          case "String":
            return (
              <Form.Item key={attr.name} label={attr.name} required>
                <Input
                  type="text"
                  name={attr.name}
                  value={clientValues[attr.name]}
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
                  value={clientValues[attr.name]}
                  onChange={(value) => handleEnumChange(attr.name, value)}
                  required
                >
                  <Option value="Active">Active</Option>
                  <Option value="Deleted">Deleted</Option>
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

export default EditClientPage;
