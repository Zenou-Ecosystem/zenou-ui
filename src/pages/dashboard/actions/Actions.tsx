import { useEffect, useState } from "react";
import Filter from "../../../components/filter/Filter";
import Button from "../../../core/Button/Button";
import BasicCard from "../../../core/card/BasicCard";
import Datatable from "../../../core/table/Datatable";
import { Dialog } from 'primereact/dialog';
import { HiPlus } from "react-icons/hi";
import useAppContext from "../../../hooks/useAppContext.hooks";
import { IActions } from "../../../interfaces/actions.interface";
import { fetchActions } from "../../../services/actions.service";
import useActionsContext from "../../../hooks/useActionsContext";
import ActionsContextProvider, { ActionsContext } from "../../../contexts/ActionsContext";
import AddAction from "./AddActions";
import { ActionsActionTypes } from "../../../store/action-types/action.actions";



function Actions() {

    const [companies, setActions] = useState<IActions[]>([]);
    const [visible, setVisible] = useState(false);
    const { state, dispatch } = useAppContext();

    const { state: actionstate, dispatch: ActionDispatch } = useActionsContext();

    const openAddActionForm = () => {
        setVisible(true);
    }

    useEffect(() => {
        (async () => {
            const res = await state;
            let data = res?.data;
            if (!data || data.length < 1) {
                data = await fetchActions();
            }
            setActions(data);
        })();

        (async () => {
            const resolvedActionstate = await actionstate;
            if (resolvedActionstate.hasCreated) {
                console.log('Action state changed => ', resolvedActionstate);
                setVisible(false);
            }
        })();

    }, [state, actionstate]);


    const cardProps = {
        content: `Statistics for the month of February. This is really making
        sense in all areas`,
        title: 'Action Reports'
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
        <ActionsContextProvider>

            <div className="w-full px-4 my-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
            </div>

            <div className="w-full px-4">
                <BasicCard title=""
                    content={() => (
                        <>
                            <div className="filter my-4 w-11/12 m-auto flex">
                                <div className="add-btn w-2/12">
                                    <Button title="New"
                                        styles="flex justify-around flex-row-reverse items-center rounded-full"
                                        onClick={openAddActionForm} Icon={{
                                            Name: HiPlus,
                                            classes: '',
                                            color: 'white'
                                        }} />
                                </div>
                                <div className="filter w-10/12">
                                    <Filter fields={filterProps} title='Filter Actions' />
                                </div>
                            </div>

                            <div className="add-form my-10">
                                <Dialog headerClassName="bg-dialog-header" contentClassName="bg-dialog-content" header="Register New Action" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                                    <AddAction />
                                </Dialog>
                            </div>
                            <Datatable
                                data={companies}
                                fields={['type', 'duration', 'department', 'theme', 'resources', 'Actions']}
                                actionTypes={ActionsActionTypes}
                                context={ActionsContext}
                            />
                        </>
                    )}
                    styles="p-0"
                />
            </div>
        </ActionsContextProvider>
    );
}


export default Actions;