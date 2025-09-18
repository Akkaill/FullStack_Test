import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Button, Table } from 'antd'
import { exportCsv } from '../lib/exportCsv'

type Row = { level:string; roomName:string; gender:'M'|'F'|'O'; total:number }

export default function ReportsPage(){
  const {data=[], isLoading} = useQuery({
    queryKey:['report-summary'],
    queryFn: async () => {
      const {data} = await api.get('/reports/summary')
      return data as Row[]
    }
  })
  return (
    <div>
      <Button onClick={()=> data.length && exportCsv('report_summary.csv', data)} style={{marginBottom:12}}>
        Export CSV
      </Button>
      <Table<Row> rowKey={(r)=>`${r.level}-${r.roomName}-${r.gender}`} loading={isLoading} dataSource={data}
        columns={[
          { title:'ระดับชั้น', dataIndex:'level' },
          { title:'ห้อง', dataIndex:'roomName' },
          { title:'เพศ', dataIndex:'gender' },
          { title:'จำนวนนักเรียน', dataIndex:'total' },
        ]}
        pagination={false}
      />
    </div>
  )
}
