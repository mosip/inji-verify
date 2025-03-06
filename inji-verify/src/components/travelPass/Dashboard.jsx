import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";
import approved_icon from '../../assets/images/approved_icon.png'
import newverify_icon from '../../assets/images/newverify_icon.png'
import rejected_icon from '../../assets/images/rejected_icon.png'

const data = [
  { month: "Jan", approved: 25, pending: 30, rejected: 20 },
  { month: "Feb", approved: 35, pending: 40, rejected: 20 },
  { month: "Mar", approved: 15, pending: 20, rejected: 15 },
  { month: "Apr", approved: 25, pending: 35, rejected: 20 },
  { month: "May", approved: 15, pending: 20, rejected: 15 },
  { month: "Jun", approved: 35, pending: 30, rejected: 20 },
  { month: "Jul", approved: 25, pending: 30, rejected: 20 },
  { month: "Aug", approved: 25, pending: 35, rejected: 20 },
  { month: "Sep", approved: 25, pending: 30, rejected: 20 },
  { month: "Oct", approved: 30, pending: 35, rejected: 20 },
  { month: "Nov", approved: 35, pending: 40, rejected: 20 },
  { month: "Dec", approved: 25, pending: 30, rejected: 20 },
];

function Card({ children, className,onClick }) {
  return (
    <div className={`bg-white shadow-lg border border-gray-200 rounded-xl p-10 flex flex-col justify-center items-center h-[331px] w-[460px] ${className}`}
      onClick={onClick} 
      role="button"
      tabIndex={0} >
      {children}
    </div>
  );
}

function CardContent({ children, className }) {
  return <div className={`flex flex-col items-center text-center ${className}`}>{children}</div>;
}

export default function Dashboard() {
    const navigate = useNavigate();
  return (
    <div className="flex h-screen bg-white">
      
      <div className="flex-1 p-8">
        {/* <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Welcome, &lt;User&gt;</h1>
        </div> */}
        <div className="flex justify-between mb-8">
          {[{ title: "New Verification", imgsrc: newverify_icon,onClick: () => navigate("/home") },
            { title: "Approved Digi-Passes", imgsrc:approved_icon },
            { title: "Rejected Digi-Passes", imgsrc: rejected_icon }].map((item, index) => (
            <Card key={index}  onClick={item.onClick}>
              <CardContent>
                <div className="w-16 h-16 flex items-center justify-center border border-gray-300 rounded-lg shadow-md">
                  <img src={item.imgsrc} className="text-[#6941C6] w-8 h-8" />
                </div>
                <h2 className="font-semibold text-xl text-[#6941C6] mt-8">{item.title}</h2>
                <p className="font-inter font-medium text-sm leading-5 tracking-normal text-center text-[#475467]">Verify and process new travel passes</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h3 className="text-2xl font-semibold text-gray-900">Total Verifications</h3>
            <p className="text-gray-500 text-sm">Keep track of the number of travel passes issued</p>
          </div>
          <div className="mt-6 w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barSize={30} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#A0AEC0" tick={{ fontSize: 12 }} label={{ value: 'Month', position: 'insideBottom', dy: 10 }} />
                <YAxis stroke="#A0AEC0" tick={{ fontSize: 12 }} label={{ value: 'Total Entries', angle: -90, position: 'insideLeft', dy: -10 }} />
                <Tooltip wrapperStyle={{ display: 'none' }} />
                <Bar dataKey="approved" fill="#53389E" stackId="a" radius={[2, 2, 0, 0]} />
                <Bar dataKey="pending" fill="#9E77ED" stackId="a" radius={[0, 0, 1, 1]} />
                <Bar dataKey="rejected" fill="#E4E7EC" stackId="a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-end">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100">View full report</button>
          </div>
        </div>
      </div>
    </div>
  );
}
