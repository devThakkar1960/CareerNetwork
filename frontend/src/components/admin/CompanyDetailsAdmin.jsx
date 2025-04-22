import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const companies = [
  { id: 1, name: "Google", recruiter: "Alice Smith" },
  { id: 2, name: "Amazon", recruiter: "John Doe" },
  { id: 3, name: "Microsoft", recruiter: "Emma Johnson" },
];

function CompanyDetailsAdmin() {
  return (
    
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Companies</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No.</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Recruiter Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company, index) => (
            <TableRow key={company.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.recruiter}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CompanyDetailsAdmin;