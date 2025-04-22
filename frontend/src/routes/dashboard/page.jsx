import { useEffect, useState } from "react";
import { Footer } from "../../layouts/footer";
import { Package, PersonStanding, TrendingUp, Trash, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { COMPANY_API_END_POINT, JOB_API_END_POINT, USER_API_END_POINT } from "../../utils/constant.js";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

const DashboardPage = () => {
    const [companyCount, setCompanyCount] = useState(0);
    const [allStudents, setAllStudents] = useState(0);
    const [allJobs, setAllJobs] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [allCompanyList, setAllCompanyList] = useState([]);

    const filteredCompanies = allCompanyList.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/getallcompany`, {
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
                setAllStudents(res.data.students.length);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStudents();
    }, []);
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getAllJobs?getJob=true`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });
                setAllJobs(res.data.jobs.length);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStudents();
    }, []);

    const deleteCompany = async (companyId, companyName) => {
        try {
            await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, {
                withCredentials: true,
            });

            const updatedList = allCompanyList.filter(c => c._id !== companyId);
            setAllCompanyList(updatedList);
            setCompanyCount(updatedList.length);
            toast.success("Company deleted successfully");
        } catch (error) {
            console.error("Error deleting company:", error);
            toast.error("Failed to delete company");
        }
    };


    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Dashboard</h1>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Total Companies Card */}
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500">
                            <Package size={26} />
                        </div>
                        <p className="card-title">Total Companies</p>
                    </div>
                    <div className="card-body bg-slate-100">
                        <p className="text-3xl font-bold text-slate-900">{companyCount}</p>
                    </div>
                </div>

                {/* Total Students Card */}
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500">
                            <PersonStanding size={26} />
                        </div>
                        <p className="card-title">Total Students</p>
                    </div>
                    <div className="card-body bg-slate-100">
                        <p className="text-3xl font-bold text-slate-900">{allStudents}</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500">
                            <PersonStanding size={26} />
                        </div>
                        <p className="card-title">Total Jobs</p>
                    </div>
                    <div className="card-body bg-slate-100">
                        <p className="text-3xl font-bold text-slate-900">{allJobs}</p>
                    </div>
                </div>
            </div>

            {/* Companies Table */}
            <div className="card">
                <div className="card-header flex justify-between items-center">
                    <p className="card-title">Companies</p>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search Company..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="rounded-md border bg-white px-8 py-2 text-sm shadow-sm"
                        />
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="relative w-full overflow-auto rounded-none [scrollbar-width:_thin]">
                        <div
                            className={`relative w-full overflow-x-auto ${filteredCompanies.length > 10 ? "max-h-[500px] overflow-y-auto custom-scrollbar" : ""
                                }`}
                        >
                            <table className="table text-sm">
                                <thead className="table-header">
                                    <tr className="table-row">
                                        <th className="table-head">No</th>
                                        <th className="table-head">Company</th>
                                        <th className="table-head">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {filteredCompanies.length > 0 ? (
                                        filteredCompanies.map((company, index) => (
                                            <tr key={company._id} className="table-row">
                                                <td className="table-cell">{index + 1}</td>
                                                <td className="table-cell">
                                                    <div className="flex w-max gap-x-3">
                                                        <img
                                                            src={company.logo || "/placeholder.jpg"}
                                                            alt={company.name}
                                                            className="h-10 w-10 rounded-md object-cover"
                                                        />
                                                        <div className="flex flex-col">
                                                            <p className="font-medium">{company.name}</p>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <p
                                                                        className="text-xs text-slate-600 break-words cursor-pointer"
                                                                    >
                                                                        {company.description && company.description.trim().length > 0 ? (
                                                                            <>
                                                                                {company.description.split(" ").slice(0, 20).join(" ")}
                                                                                {company.description.split(" ").length > 20 ? "..." : ""}
                                                                            </>
                                                                        ) : (
                                                                            <span className="text-slate-400 italic">No description</span>
                                                                        )}

                                                                    </p>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="max-w-sm text-sm">
                                                                    {company.description}
                                                                </PopoverContent>
                                                            </Popover>

                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="table-cell">
                                                    <div className="flex items-center gap-x-4">
                                                        <button
                                                            className="text-red-500"
                                                            onClick={() => deleteCompany(company._id, company.name)}
                                                        >
                                                            <Trash size={18} />
                                                        </button>


                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="table-row">
                                            <td colSpan="3" className="table-cell text-center py-4">
                                                No companies found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DashboardPage;
