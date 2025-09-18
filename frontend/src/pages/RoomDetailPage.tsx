import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Button, Select, Space, Table, message } from "antd";
import { useState } from "react";

export default function RoomDetailPage() {
  const { id } = useParams();
  const roomId = Number(id);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["room-members", roomId],
    queryFn: async () => {
      const { data } = await api.get(`/rooms/${roomId}/members`);
      return data as {
        id: number;
        student: {
          id: number;
          studentCode: string;
          firstName: string;
          lastName: string;
          nickName?: string;
        };
      }[];
    },
  });

  // ค้นหานักเรียนเพื่อเพิ่มเข้าห้อง (ใช้ /students?search=...)
  const [kw, setKw] = useState("");
  const { data: options } = useQuery({
    queryKey: ["students-search", kw],
    queryFn: async () => {
      if (!kw) return [];
      const { data } = await api.get("/students", { params: { search: kw } });
      return (data.items || []).map((s: any) => ({
        value: s.id,
        label: `${s.studentCode} - ${s.firstName} ${s.lastName}`,
      }));
    },
    enabled: !!kw,
  });

  const addMut = useMutation({
    mutationFn: (studentId: number) =>
      api.post(`/rooms/${roomId}/members`, { studentId }),
    onSuccess: () => {
      message.success("Added");
      qc.invalidateQueries({ queryKey: ["room-members", roomId] });
    },
  });
  const leaveMut = useMutation({
    mutationFn: (memberId: number) =>
      api.patch(`/rooms/${roomId}/members/${memberId}/leave`),
    onSuccess: () => {
      message.success("Removed");
      qc.invalidateQueries({ queryKey: ["room-members", roomId] });
    },
  });

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          showSearch
          allowClear
          style={{ minWidth: 320 }}
          placeholder="ค้นหานักเรียนเพื่อเพิ่มเข้าห้อง"
          onSearch={setKw}
          filterOption={false}
          options={options || []}
          onChange={(val) => {
            if (val) addMut.mutate(val);
          }}
          notFoundContent={kw && !options?.length ? "ไม่พบ" : null}
        />
      </Space>

      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={data || []}
        columns={[
          { title: "รหัส", render: (_: any, r: any) => r.student.studentCode },
          {
            title: "ชื่อ",
            render: (_: any, r: any) =>
              `${r.student.firstName} ${r.student.lastName}`,
          },
          { title: "ชื่อเล่น", render: (_: any, r: any) => r.student.nickName },
          {
            title: "จัดการ",
            render: (_: any, r: any) => (
              <Button danger size="small" onClick={() => leaveMut.mutate(r.id)}>
                เอาออก
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
