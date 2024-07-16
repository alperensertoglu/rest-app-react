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
import ClientCreatePage from "../pages/ClientCreatePage";
import ClientEditPage from "../pages/ClientEditPage";
import {
  deleteClient,
  getClientCount,
  paginationClient,
  getColumns,
} from "../utility/Rest";

function ClientTableComponent() {
  const [clients, setClients] = useState([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalClients, setTotalClients] = useState(0);
  const [cols, setCols] = useState([]);
  const [attributes, setAttributes] = useState([]);

  const fetchData = useCallback(
    async (
      pageNum = currentPage,
      pageSizeNum = pageSize,
      searchValue = searchInput
    ) => {
      try {
        const response = await paginationClient(
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
          setClients(response.Clients || []);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching paginated clients:", error.message);
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
        const total = await getClientCount();
        setTotalClients(total);
      } catch (error) {
        console.error("Error fetching total clients:", error.message);
      }
    }
    fetchTotalCount();
  }, [pageSize, fetchData]);

  const handleSearch = async (value) => {
    setSearchInput(value);
    setCurrentPage(1);
  };

  const handleEdit = (record) => {
    setClientData(record);
    setEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setEditModalVisible(false);
  };

  const handleDelete = (record) => {
    const { ClientId } = record;
    Swal.fire({
      title: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log("Client ID for Delete:", ClientId);
          await deleteClient(ClientId);
          fetchData(currentPage, pageSize);
          Swal.fire("Deleted!", "Your client has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete client.", "error");
          console.error("Error deleting client:", error);
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
            total={totalClients}
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
            dataSource={clients.map((client) => ({
              ...client,
              key: client.ClientId,
            }))}
            pagination={false}
          />
        </Col>
      </Row>

      <Modal
        title="Create Client"
        open={isCreateModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <ClientCreatePage
          handleCancel={handleCancel}
          fetchData={fetchData}
          attributes={attributes}
        />
      </Modal>
      <Modal
        title={clientData?.title}
        open={editModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        {clientData && (
          <ClientEditPage
            handleCancel={handleCancel}
            clientData={clientData}
            fetchData={fetchData}
            attributes={attributes}
          />
        )}
      </Modal>
      {/* <Button type="primary" onClick={() => navigate("/table")}>
        Go to Form Table
      </Button> */}
    </div>
  );
}

export default ClientTableComponent;
