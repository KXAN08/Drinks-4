import { useEffect, useState } from "react";
import { api } from "../api";
import {
  Button, Modal, Form, Input, InputNumber,
  Select, Table, Popconfirm, Image, message
} from "antd";

const { Option } = Select;

const Drinks = () => {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/drinks");
        setData(res.data);
      } catch {
        message.error("Ichimliklarni yuklashda xatolik");
      }
    };
    fetchData();
  }, []);

  const showModal = (item = null) => {
    setEdit(item);
    form.setFieldsValue(item || {});
    setOpen(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/drinks/${id}`);
    message.success("O‘chirildi");
    const res = await api.get("/drinks");
    setData(res.data);
  };

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      if (edit) await api.put(`/drinks/${edit.id}`, values);
      else await api.post("/drinks", values);

      message.success(edit ? "Yangilandi" : "Qo‘shildi");
      const res = await api.get("/drinks");
      setData(res.data);
      setOpen(false);
      form.resetFields();
      setEdit(null);
    } catch {
      message.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Rasm",
      dataIndex: "image",
      render: (src) => <Image src={src} width={60} height={60} />
    },
    { title: "Nom", dataIndex: "title" },
    { title: "Firma", dataIndex: "company_name" },
    { title: "Narx", dataIndex: "price" },
    { title: "Hajm", dataIndex: "volume" },
    { title: "Turi", dataIndex: "type" },
    {
      title: "Amallar",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button onClick={() => showModal(record)} type="link">Edit</Button>
          <Popconfirm
            title="O‘chirishni xohlaysizmi?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger type="link">Delete</Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Ichimliklar</h2>
        <Button type="primary" onClick={() => showModal()}>
          Yangi ichimlik
        </Button>
      </div>

      <Table dataSource={data} columns={columns} rowKey="id" />

      <Modal
        title={edit ? "Ichimlikni tahrirlash" : "Yangi ichimlik qo‘shish"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEdit(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
        okText={edit ? "Yangilash" : "Qo‘shish"}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="title" label="Nom" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="company_name" label="Firma" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Narx" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="volume" label="Hajm" rules={[{ required: true }]}>
            <Input placeholder="0.5L" />
          </Form.Item>
          <Form.Item name="type" label="Turi" rules={[{ required: true }]}>
            <Select>
              <Option value="gazli">Gazli</Option>
              <Option value="gazsiz">Gazsiz</Option>
            </Select>
          </Form.Item>
          <Form.Item name="image" label="Rasm (URL)" rules={[{ required: true, type: "url" }]}>
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Drinks;
