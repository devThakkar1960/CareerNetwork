import axios from "axios";
import {
  parseISO,
  format,
} from "date-fns";
import { useEffect, useState } from "react";
import { Footer } from "../../layouts/footer";
import { COMPANY_API_END_POINT, USER_API_END_POINT } from "../../utils/constant";

const Analytics = () => {
  const width = 800;
  const height = 400;
  const padding = 40;

  const [allCompanyList, setAllCompanyList] = useState([]);
  const [companyCount, setCompanyCount] = useState(0);
  const [allStudents, setAllStudents] = useState(0);
  const [allStudentsList, setAllStudentsList] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get?isAdmin=true`, {
          withCredentials: true,
        });
        setAllCompanyList(res.data.companies);
        setCompanyCount(res.data.companies.length);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/getAllStudents?getRole=true`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setAllStudentsList(res.data.students);
        setAllStudents(res.data.students.length);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStudents();
  }, []);

  const prepareChartData = (list) => {
    const data = list.map((item) => {
      const day = format(parseISO(item.createdAt), "yyyy-MM-dd");
      return { day, total: 1 };
    });

    const grouped = data.reduce((acc, curr) => {
      const found = acc.find((item) => item.day === curr.day);
      if (found) {
        found.total++;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, []);

    return grouped.sort((a, b) => new Date(a.day) - new Date(b.day));
  };

  const companyData = prepareChartData(allCompanyList);
  const studentData = prepareChartData(allStudentsList);

  const step = 2;
  const maxY = Math.ceil(Math.max(companyCount, allStudents) / step) * step || 4;

  const getPoints = (data) => {
    return data.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - ((d.total / maxY) * (height - 2 * padding));
      return [x, y];
    });
  };

  const companyPoints = getPoints(companyData);
  const studentPoints = getPoints(studentData);

  const createPath = (points) => points.reduce(
    (acc, [x, y], i) => acc + (i === 0 ? `M ${x},${y}` : ` L ${x},${y}`),
    ""
  );

  const createArea = (points) => {
    if (points.length === 0) return "";
    const areaPath = points.reduce((acc, [x, y], i) => acc + (i === 0 ? `M ${x},${y}` : ` L ${x},${y}`), "");
    const lastX = points[points.length - 1][0];
    return `${areaPath} L ${lastX},${height - padding} L ${points[0][0]},${height - padding} Z`;
  };

  const companyPath = createPath(companyPoints);
  const studentPath = createPath(studentPoints);
  const areaPath = createArea(companyPoints);
  
  const renderYAxis = () => (
    Array.from({ length: Math.floor(maxY / step) + 1 }, (_, i) => {
      const value = i * step;
      const y = height - padding - (value / maxY) * (height - 2 * padding);
      return (
        <text key={i} x={padding - 10} y={y + 4} fontSize="12" textAnchor="end" fill="#94a3b8">
          {value}
        </text>
      );
    })
  );

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Analytics</h1>

      {/* Company Line Chart */}
      <div className="card w-full">
        <div className="card-header">
          <p className="card-title">Company Registrations (Over Days)</p>
        </div>
        <div className="card-body">
          <svg width={width} height={height} className="w-full max-w-full">
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />

            {Array.from({ length: Math.floor(maxY / step) + 1 }, (_, i) => {
              const value = i * step;
              const y = height - padding - (value / maxY) * (height - 2 * padding);
              return (
                <text key={i} x={padding - 10} y={y + 4} fontSize="12" textAnchor="end" fill="#94a3b8">
                  {value}
                </text>
              );
            })}

            {companyPoints.map(([x], i) => (
              <text key={i} x={x} y={height - padding + 15} fontSize="10" textAnchor="middle" fill="#94a3b8">
                {format(parseISO(companyData[i].day), "MM/dd")}
              </text>
            ))}

            <path d={companyPath} fill="none" stroke="#2563eb" strokeWidth="2" />
            {companyPoints.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={4} fill="#2563eb" />
            ))}
          </svg>
        </div>
      </div>

      {/* Student Line Chart */}
      <div className="card w-full">
        <div className="card-header">
          <p className="card-title">Student Registrations (Over Days)</p>
        </div>
        <div className="card-body">
          <svg width={width} height={height} className="w-full max-w-full">
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />

            {Array.from({ length: Math.floor(maxY / step) + 1 }, (_, i) => {
              const value = i * step;
              const y = height - padding - (value / maxY) * (height - 2 * padding);
              return (
                <text key={i} x={padding - 10} y={y + 4} fontSize="12" textAnchor="end" fill="#94a3b8">
                  {value}
                </text>
              );
            })}

            {studentPoints.map(([x], i) => (
              <text key={i} x={x} y={height - padding + 15} fontSize="10" textAnchor="middle" fill="#94a3b8">
                {format(parseISO(studentData[i].day), "MM/dd")}
              </text>
            ))}

            <path d={studentPath} fill="none" stroke="#10b981" strokeWidth="2" />
            {studentPoints.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={4} fill="#10b981" />
            ))}
          </svg>
        </div>
      </div>

      {/* Area Chart Over Days */}
           <div className="card w-full">
             <div className="card-header">
               <p className="card-title">Company vs Student Area Chart (Over Days)</p>
             </div>
             <div className="card-body">
               <svg width={width} height={height} className="w-full max-w-full">
                 <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" />
                 <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />
                 {renderYAxis()}
                 {companyPoints.map(([x], i) => (
                   <text key={i} x={x} y={height - padding + 15} fontSize="10" textAnchor="middle" fill="#94a3b8">
                     {format(parseISO(companyData[i].day), "MM/dd")}
                   </text>
                 ))}
                 <path d={areaPath} fill="rgba(37, 99, 235, 0.3)" stroke="#2563eb" strokeWidth="2" />
                 <path d={studentPath} fill="none" stroke="#10b981" strokeWidth="2" />
                 {studentPoints.map(([x, y], i) => (
                   <circle key={i} cx={x} cy={y} r={3} fill="#10b981" />
                 ))}
               </svg>
             </div>
           </div>

      <Footer />
    </div>
  );
};

export default Analytics;