import { useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

type Student = {
  id: number;
  studentCode: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  gender: "M" | "F" | "O";
  birthDate?: string | null;
  level: string;
};

const genderLabels: Record<Student["gender"], string> = {
  M: "ชาย",
  F: "หญิง",
  O: "อื่นๆ",
};

export default function StudentsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [by, setBy] = useState<"code" | "name" | "nickname">("code");
  const [level, setLevel] = useState<string>();
  const [gender, setGender] = useState<Student["gender"]>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["students", { search, by, level, gender, page, limit }],
    queryFn: async () => {
      const { data } = await api.get("/students", {
        params: { search, by, level, gender, page, limit },
      });
      return data as {
        items: Student[];
        total: number;
        page: number;
        limit: number;
      };
    },
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form] = Form.useForm();

  const createMut = useMutation({
    mutationFn: (payload: any) => api.post("/students", payload),
    onSuccess: () => {
      message.success("Created");
      qc.invalidateQueries({ queryKey: ["students"] });
      setOpen(false);
    },
  });
  const updateMut = useMutation({
    mutationFn: (payload: any) =>
      api.patch(`/students/${editing!.id}`, payload),
    onSuccess: () => {
      message.success("Updated");
      qc.invalidateQueries({ queryKey: ["students"] });
      setOpen(false);
      setEditing(null);
    },
  });
  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/students/${id}`),
    onSuccess: () => {
      message.success("Deleted");
      qc.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const columns = useMemo(
    () => [
      { title: "Code", dataIndex: "studentCode" },
      {
        title: "ชื่อ",
        render: (_: any, r: Student) => `${r.firstName} ${r.lastName}`,
      },
      { title: "ชื่อเล่น", dataIndex: "nickName" },
      {
        title: "เพศ",
        dataIndex: "gender",
        render: (g: Student["gender"]) => <Tag>{genderLabels[g]}</Tag>,
      },
      { title: "ชั้น", dataIndex: "level" },
      {
        title: "จัดการ",
        render: (_: any, r: Student) => (
          <Space>
            <Button
              size="small"
              onClick={() => {
                setEditing(r);
                form.setFieldsValue({
                  ...r,
                  birthDate: r.birthDate?.slice(0, 10),
                });
                setOpen(true);
              }}
            >
              Edit
            </Button>
            <Button size="small" danger onClick={() => deleteMut.mutate(r.id)}>
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          value={by}
          onChange={(v) => setBy(v)}
          options={[
            { value: "code", label: "ค้นหาด้วยรหัส" },
            { value: "name", label: "ค้นหาด้วยชื่อ-นามสกุล" },
            { value: "nickname", label: "ค้นหาด้วยชื่อเล่น" },
          ]}
        />
        <Input
          placeholder="คำค้น"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Input
          placeholder="ระดับชั้น (เช่น ม.1)"
          value={level}
          onChange={(e) => setLevel(e.target.value || undefined)}
        />
        <Select
          placeholder="เพศ"
          value={gender}
          onChange={(v) => setGender(v)}
          allowClear
          options={[
            { value: "M", label: "ชาย" },
            { value: "F", label: "หญิง" },
            { value: "O", label: "อื่นๆ" },
          ]}
        />
        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setOpen(true);
          }}
        >
          Add Student
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={data?.items || []}
        pagination={{
          current: data?.page || page,
          pageSize: data?.limit || limit,
          total: data?.total || 0,
          onChange: (p, ps) => {
            setPage(p);
            setLimit(ps);
          },
        }}
      />

      <Modal
        open={open}
        title={editing ? "Edit Student" : "Add Student"}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
        }}
        onOk={() => form.submit()}
        confirmLoading={createMut.isPending || updateMut.isPending}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            const payload = { ...values };
            if (!payload.birthDate) delete payload.birthDate;
            editing ? updateMut.mutate(payload) : createMut.mutate(payload);
          }}
        >
          <Form.Item
            name="studentCode"
            label="รหัสนักเรียน"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="firstName" label="ชื่อ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="นามสกุล"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="nickName" label="ชื่อเล่น">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="เพศ" initialValue="O">
            <Select
              options={[
                { value: "M", label: "ชาย" },
                { value: "F", label: "หญิง" },
                { value: "O", label: "อื่นๆ" },
              ]}
            />
          </Form.Item>
          <Form.Item name="birthDate" label="วันเกิด (YYYY-MM-DD)">
            <Input placeholder="2008-05-20" />
          </Form.Item>
          <Form.Item
            name="level"
            label="ระดับชั้น"
            rules={[{ required: true }]}
          >
            <Input placeholder="ม.1" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
