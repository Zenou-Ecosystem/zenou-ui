import { useEffect, useState } from "react";
import { fecthCompanies } from "../../../api/companies";
import Filter from "../../../components/filter/Filter";
import Button from "../../../core/Button/Button";
import BasicCard from "../../../core/card/BasicCard";
import Datatable from "../../../core/table/Datatable";
import { Dialog } from 'primereact/dialog';
import { ICompany } from "../../../interfaces/company.interface";
import AddCompany from "./AddCompany";
import { HiPlus } from "react-icons/hi";

function CompaniesList() {

    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [visible, setVisible] = useState(false);

    const openAddCompanyForm = () => {
        setVisible(true);
    }

    useEffect(() => {
        const func = async () => {
            const res = await fecthCompanies();
            const data = await res.json()
            setCompanies(data);
        }
        func();
    }, [])

    const cardProps = {
        content: `Statistics for the month of February. This is really making
        sense in all areas`,
        title: 'Company Statistics'
    }
    const handleNameFilter = (query: string) => {
        console.log("The name typed is ", query);

    }
    const handleCountryFilter = (query: string) => {
        console.log("The country typed is ", query);

    }
    const handleCategoryFilter = (query: string) => {
        console.log("The category typed is ", query);

    }

    const handleCertificationFilter = (query: string) => {
        console.log("The certificate typed is ", query);

    }
    const filterProps = [{
        type: "text",
        onChange: handleNameFilter,
        placeholder: "Name"
    },
    {
        type: "text",
        onChange: handleCountryFilter,
        placeholder: "Country"
    }, {
        type: "text",
        onChange: handleCategoryFilter,
        placeholder: "Category"
    },
    {
        type: "text",
        onChange: handleCertificationFilter,
        placeholder: "Certification"
    }
    ];

    return (
        <>
            <div className="filter my-4 w-11/12 m-auto flex">
                <div className="add-btn w-2/12">
                    <Button title="New"
                        styles="flex justify-around flex-row-reverse items-center"
                        onClick={openAddCompanyForm} Icon={{
                            Name: HiPlus,
                            classes: '',
                            color: 'white'
                        }} />
                </div>
                <div className="filter w-10/12">
                    <Filter fields={filterProps} />
                </div>
            </div>

            <div className="add-form my-10">
                <Dialog header="Register New Company" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                    <AddCompany />
                </Dialog>
            </div>

            {/* <div className="my-4 flex gap-4">
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
            </div> */}

            <BasicCard title="" content={() => (<Datatable data={companies} fields={['name', 'category', 'country', 'certification']} />)} />
        </>
    );
}


export default CompaniesList;