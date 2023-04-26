import { useEffect, useState } from "react";
import Filter from "../../../components/filter/Filter";
import Button from "../../../core/Button/Button";
import BasicCard from "../../../core/card/BasicCard";
import Datatable from "../../../core/table/Datatable";
import { Dialog } from 'primereact/dialog';
import AddLaw from "./AddLaw";
import { HiPlus } from "react-icons/hi";
import useAppContext from "../../../hooks/useAppContext.hooks";
import LawContextProvider, { LawContext } from "../../../contexts/LawContext";
import useLawContext from "../../../hooks/useLawContext";
import { ILaws } from "../../../interfaces/laws.interface";
import { LawActionTypes } from "../../../store/action-types/laws.actions";
import { fetchLaws } from "../../../services/laws.service";

function Laws() {

    const [laws, setLaws] = useState<ILaws[]>([]);
    const [visible, setVisible] = useState(false);
    const { state } = useAppContext();

    const { state: LawState } = useLawContext();

    const openAddLawForm = () => {
        setVisible(true);
    }

    useEffect(() => {
        (async () => {
            const res = await state;
            let data = res?.data;
            if (!data || data?.length < 1) {
                data = await fetchLaws();
            }
            setLaws(data);
        })();

        (async () => {
            const resolvedLawState = await LawState;
            if (resolvedLawState.hasCreated) {
                console.log('Law state changed => ', resolvedLawState);
                setVisible(false);
            }
        })();

    }, [state, LawState]);


    const cardProps = {
        content: `Statistics for the month of February. This is really making
        sense in all areas`,
        title: 'Law Statistics'
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
        <LawContextProvider>

            {/* <div className="w-full px-4 my-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
            </div> */}

            <div className="w-full px-4">
                <BasicCard title=""
                    content={() => (
                        <>
                            <div className="filter my-4 w-11/12 m-auto flex">
                                <div className="add-btn w-2/12">
                                    <Button title="New"
                                        styles="flex justify-around flex-row-reverse items-center rounded-full"
                                        onClick={openAddLawForm} Icon={{
                                            Name: HiPlus,
                                            classes: '',
                                            color: 'white'
                                        }} />
                                </div>
                                <div className="filter w-10/12">
                                    <Filter fields={filterProps} title="Filter laws" />
                                </div>
                            </div>

                            <div className="add-form my-10">
                                <Dialog header="Register New Law"
                                    visible={visible}
                                    style={{ width: '80vw', height: '100vh' }}
                                    onHide={() => setVisible(false)}>
                                    <AddLaw laws={laws} />
                                </Dialog>
                            </div>

                            <Datatable
                                data={laws}
                                fields={['title', 'theme', 'ratification', 'compliance', 'Actions']}
                                actionTypes={LawActionTypes}
                                context={LawContext}
                            />
                        </>
                    )

                    }
                    styles="p-0"
                />
            </div>
        </LawContextProvider>
    );
}


export default Laws;