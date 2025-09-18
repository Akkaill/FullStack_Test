import { useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  message,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

type Room = {
  id: number;
  roomCode: string;
  roomName: string;
  level: string;
  academicYear?: string;
  homeroomTeacher?: string;
};

export default function RoomsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [by, setBy] = useState<"code" | "name" | "teacher">("code");
  const [level, setLevel] = useState<string>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [academicYear, setAcademicYear] = useState<string>();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["rooms", { search, by, level, academicYear, page, limit }],
    queryFn: async () => {
      const { data } = await api.get("/rooms", {
        params: { search, by, level, academicYear, page, limit },
      });
      return data as {
        items: Room[];
        total: number;
        page: number;
        limit: number;
      };
    },
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [form] = Form.useForm();
  function showErr(e: any) {
    const m = e?.response?.data?.message || e?.message || "เกิดข้อผิดพลาด";
    message.error(Array.isArray(m) ? m.join(", ") : m);
  }
  const createMut = useMutation({
    mutationFn: (payload: any) => api.post("/rooms", payload),
    onSuccess: async () => {
      message.success("Created");
      setOpen(false);
      form.resetFields();
      setPage(1);
      await qc.invalidateQueries({ queryKey: ["rooms"], exact: false });
    },
    onError: showErr,
  });

  const updateMut = useMutation({
    mutationFn: (payload: any) => api.patch(`/rooms/${editing!.id}`, payload),
    onSuccess: async () => {
      message.success("Updated");
      setOpen(false);
      setEditing(null);
      form.resetFields();
      await qc.invalidateQueries({ queryKey: ["rooms"], exact: false });
      refetch();
    },
    onError: showErr,
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/rooms/${id}`),
    onSuccess: async () => {
      message.success("Deleted");
      await qc.invalidateQueries({ queryKey: ["rooms"], exact: false });
      refetch();
    },
    onError: showErr,
  });

  const columns = useMemo(
    () => [
      { title: "Code", dataIndex: "roomCode" },
      {
        title: "ชื่อห้อง",
        dataIndex: "roomName",
        render: (v: string, r: Room) => <Link to={`/rooms/${r.id}`}>{v}</Link>,
      },
      { title: "ชั้น", dataIndex: "level" },
      { title: "ปีการศึกษา", dataIndex: "academicYear" },
      { title: "ครูประจำชั้น", dataIndex: "homeroomTeacher" },
      {
        title: "จัดการ",
        render: (_: any, r: Room) => (
          <Space>
            <Button
              size="small"
              onClick={() => {
                setEditing(r);
                form.setFieldsValue(r);
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
          onChange={setBy}
          options={[
            { value: "code", label: "ค้นหาด้วยเลขห้อง" },
            { value: "name", label: "ค้นหาด้วยชื่อห้อง" },
            { value: "teacher", label: "ค้นหาด้วยครูประจำชั้น" },
          ]}
        />
        <Input
          placeholder="คำค้น"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Input
          placeholder="ระดับชั้น"
          value={level}
          onChange={(e) => setLevel(e.target.value || undefined)}
        />
        <Input
          placeholder="ปีการศึกษา (เช่น 2025)"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value || undefined)}
        />
        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setOpen(true);
          }}
        >
          Add Room
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
        title={editing ? "Edit Room" : "Add Room"}
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
          initialValues={{ academicYear: new Date().getFullYear().toString() }}
          onFinish={(values) =>
            editing ? updateMut.mutate(values) : createMut.mutate(values)
          }
        >
          <Form.Item
            name="roomCode"
            label="เลขห้อง"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="roomName"
            label="ชื่อห้อง"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="level"
            label="ระดับชั้น"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="academicYear"
            label="ปีการศึกษา"
            rules={[{ required: true }]}
          >
            <Input placeholder="2025" />
          </Form.Item>
          <Form.Item name="homeroomTeacher" label="ครูประจำชั้น">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
