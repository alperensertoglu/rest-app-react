import { Button, Col, Form, Input, Row, Select } from "antd";
import { useState } from "react";
import { createForm } from "../utility/Rest";

const { Option } = Select;

function CreatePage({ handleCancel, fetchData, attributes }) {
  const [formData, setFormData] = useState(
    attributes.reduce((acc, attr) => {
      acc[attr.name] = "";
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEnumChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      console.log("formData: ", formData);
      await createForm(formData);
      fetchData();
      handleCancel();
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  return (
    <Form
      onFinish={handleSubmit}
      layout="vertical"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      {attributes.map((attr) => {
        if (attr.name === "FormId") return null;

        switch (attr.type) {
          case "String":
            return (
              <Form.Item key={attr.name} label={attr.name} required>
                <Input
                  type="text"
                  name={attr.name}
                  value={formData[attr.name]}
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
                  value={formData[attr.name]}
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

export default CreatePage;
