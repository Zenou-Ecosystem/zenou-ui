import { useEffect, useState } from "react";
import { fecthCompanies } from "../../../services/companies.service";
import Filter from "../../../components/filter/Filter";
import Button from "../../../core/Button/Button";
import BasicCard from "../../../core/card/BasicCard";
import Datatable from "../../../core/table/Datatable";
import { Dialog } from 'primereact/dialog';
import { ICompany } from "../../../interfaces/company.interface";
import AddCompany from "./AddCompany";
import { HiPlus } from "react-icons/hi";
import useAppContext from "../../../hooks/useAppContext.hooks";
import CompanyContextProvider, { CompanyContext } from "../../../contexts/CompanyContext";
import useCompanyContext from "../../../hooks/useCompanyContext";
import { CompanyActionTypes } from "../../../store/action-types/company.actions";

function CompaniesList() {

    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [visible, setVisible] = useState(false);
    const { state, dispatch } = useAppContext();

    const { state: companyState, dispatch: companyDispatch } = useCompanyContext();

    const openAddCompanyForm = () => {
        setVisible(true);
    }

    useEffect(() => {
        (async () => {
            const res = await state;
            let data = res?.data;
            if (!data || data.length < 1) {
                data = await fecthCompanies();
            }
            setCompanies(data);
        })();

        (async () => {
            const resolvedCompanyState = await companyState;
            if (resolvedCompanyState.hasCreated) {
                console.log('Company state changed => ', resolvedCompanyState);
                setVisible(false);
            }
        })();

    }, [state, companyState]);


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
        <CompanyContextProvider>
            <div className="filter my-4 w-11/12 m-auto flex">
                <div className="add-btn w-2/12">
                    <Button title="New"
                        styles="flex justify-around flex-row-reverse items-center rounded-full"
                        onClick={openAddCompanyForm} Icon={{
                            Name: HiPlus,
                            classes: '',
                            color: 'white'
                        }} />
                </div>
                <div className="filter w-10/12">
                    <Filter fields={filterProps} title="Filter Companies" />
                </div>
            </div>

            <div className="add-form my-10">
                <Dialog header="Register New Company" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                    <AddCompany />
                </Dialog>
            </div>

            <div className="w-full px-4 my-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
            </div>

            <div className="w-full px-4">
                <BasicCard title=""
                    content={() => (
                        <Datatable
                            data={companies}
                            fields={['name', 'category', 'country', 'certification']}
                            actionTypes={CompanyActionTypes}
                            context={CompanyContext}
                        />)}
                    styles="p-0"
                />
            </div>
        </CompanyContextProvider>
    );
}


export default CompaniesList;