import {
  Button,
  Col,
  Input,
  Menu,
  Modal,
  Pagination,
  Row,
  Select,
  Table,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import CreatePage from "../pages/CreatePage";
import EditPage from "../pages/EditPage";
import {
  deleteForm,
  getAllFormCount,
  paginationForm,
  getColumns,
} from "../utility/Rest";
import { useNavigate } from "react-router-dom";

function TableComponent() {
  const [forms, setForms] = useState([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [formData, setFormData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalForms, setTotalForms] = useState(0);
  const [cols, setCols] = useState([]);
  const [attributes, setAttributes] = useState([]);

  const navigate = useNavigate();

  const fetchData = useCallback(
    async (
      pageNum = currentPage,
      pageSizeNum = pageSize,
      searchValue = searchInput
    ) => {
      try {
        const response = await paginationForm(
          pageNum,
          pageSizeNum,
          searchValue
        );
        if (
          response &&
          response.AttributeSelector &&
          Array.isArray(response.AttributeSelector.MxObjectMembers)
        ) {
          const attributeNames = response.AttributeSelector.MxObjectMembers.map(
            (member) => member.AttributeName
          );
          const attributeDetails =
            response.AttributeSelector.MxObjectMembers.map((member) => ({
              name: member.AttributeName,
              type: member.AttributeType,
            }));
          setCols(attributeNames);
          setAttributes(attributeDetails);
          setForms(response.Forms_2 || []);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching paginated forms:", error.message);
      }
    },
    [currentPage, pageSize, searchInput]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, currentPage, pageSize, searchInput]);

  useEffect(() => {
    async function fetchTotalCount() {
      try {
        const total = await getAllFormCount();
        setTotalForms(total);
      } catch (error) {
        console.error("Error fetching total forms:", error.message);
      }
    }
    fetchTotalCount();
  }, [pageSize, fetchData]);

  const handleSearch = async (value) => {
    setSearchInput(value);
    setCurrentPage(1);
  };

  const handleEdit = (record) => {
    setFormData(record);
    setEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setEditModalVisible(false);
  };

  const handleDelete = (record) => {
    const { FormId } = record;
    Swal.fire({
      title: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteForm(FormId);
          fetchData(currentPage, pageSize);
          Swal.fire("Deleted!", "Your form has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete form.", "error");
          console.error("Error deleting form:", error);
        }
      }
    });
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchData(page, pageSize);
  };

  const handleChangePageSize = (value) => {
    setPageSize(value);
    setCurrentPage(1);
    fetchData(1, value);
  };

  const columns = [
    ...cols.map((col) => ({
      title: col,
      dataIndex: col,
    })),
    {
      title: "Actions",
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Row style={{ padding: "2%" }} justify="space-between" align="center">
        <Col span={8}>
          <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
            Create
          </Button>
          <Input
            placeholder="Search by Title"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: "20px", width: "300px" }}
          />
        </Col>
        <Col span={8} style={{ textAlign: "center" }}>
          <Menu>
            <Select
              onChange={(value) => handleChangePageSize(value)}
              defaultValue={pageSize}
            >
              <Select.Option value={5}>5</Select.Option>
              <Select.Option value={8}>8</Select.Option>
              <Select.Option value={10}>10</Select.Option>
            </Select>
          </Menu>
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Pagination
            current={currentPage}
            total={totalForms}
            pageSize={pageSize}
            onChange={handlePageChange}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={forms.map((form) => ({
              ...form,
              key: form.FormId,
            }))}
            pagination={false}
          />
        </Col>
      </Row>

      <Modal
        title="Create Form"
        open={isCreateModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <CreatePage
          handleCancel={handleCancel}
          fetchData={fetchData}
          attributes={attributes}
        />
      </Modal>
      <Modal
        title={formData?.title}
        open={editModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        {formData && (
          <EditPage
            handleCancel={handleCancel}
            formData={formData}
            fetchData={fetchData}
            attributes={attributes}
          />
        )}
      </Modal>
      <Button type="primary" onClick={() => navigate("/client-table")}>
        Go to Client Table
      </Button>
    </div>
  );
}

export default TableComponent;
