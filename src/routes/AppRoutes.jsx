import { Routes, Route } from "react-router-dom";

import Layout from "../layout/Layout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Vehicles from "../pages/Vehicles";
import Equipments from "../pages/Equipments";
import AddEquipment from "../pages/AddEquipment";
import AddVehicle from "../pages/AddVehicle";   
import ViewVehicle from "../pages/ViewVehicle";
import ViewEquipment from "../pages/ViewEquipment";
import OtpPage from "../pages/OtpPage";
import PublicDocuments from "../pages/PublicDocuments";
import AuthGuard from "./AuthGuard";


export default function AppRoutes() {

  return (

    <Routes>
      
       <Route path="/" element={<Login />} />

      <Route path="/scan/:text" element={<OtpPage />} />

      <Route path="/public/:text" element={<PublicDocuments />} />

      <Route element={<Layout />}>
      

      <Route path="/dashboard" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />

        <Route path="/vehicles" element={<Vehicles />} />

        <Route path="/equipments" element={<Equipments />} />

        <Route path="/add-equipment" element={<AddEquipment />}/>

         <Route path="/add-vehicle" element={<AddVehicle />}/>

         <Route path="/vehicle/:id" element={<ViewVehicle />}/>

         <Route path='/equipment/:id' element={<ViewEquipment/>}/>

      </Route>

    </Routes>

  );

}

//******************************************************************************** */
import { Routes, Route, Navigate } from "react-router-dom";

// import Layout from "../layout/Layout";
// import Login from "../pages/Login";
// import Dashboard from "../pages/Dashboard";
// import Vehicles from "../pages/Vehicles";
// import Equipments from "../pages/Equipments";
// import AddEquipment from "../pages/AddEquipment";
// import AddVehicle from "../pages/AddVehicle";
// import ViewVehicle from "../pages/ViewVehicle";
// import ViewEquipment from "../pages/ViewEquipment";
// import OtpPage from "../pages/OtpPage";
// import PublicDocuments from "../pages/PublicDocuments";

// import AuthGuard from "./AuthGuard";


// export default function AppRoutes() {

//   const token =
//     localStorage.getItem("token");

//   return (

//     <Routes>

//       {/* LOGIN */}

//       <Route
//         path="/"
//         element={
//           token
//             ? <Navigate to="/dashboard" />
//             : <Login />
//         }
//       />


//       {/* PUBLIC */}

//       <Route
//         path="/scan/:text"
//         element={<OtpPage />}
//       />

//       <Route
//         path="/public/:text"
//         element={<PublicDocuments />}
//       />


//       {/* PROTECTED */}

//       <Route
//         element={
//           <AuthGuard>
//             <Layout />
//           </AuthGuard>
//         }
//       >

//         <Route
//           path="/dashboard"
//           element={<Dashboard />}
//         />

//         <Route
//           path="/vehicles"
//           element={<Vehicles />}
//         />

//         <Route
//           path="/equipments"
//           element={<Equipments />}
//         />

//         <Route
//           path="/add-vehicle"
//           element={<AddVehicle />}
//         />

//         <Route
//           path="/add-equipment"
//           element={<AddEquipment />}
//         />

//         <Route
//           path="/vehicle/:id"
//           element={<ViewVehicle />}
//         />

//         <Route
//           path="/equipment/:id"
//           element={<ViewEquipment />}
//         />

//       </Route>


//       {/* fallback */}

//       <Route
//         path="*"
//         element={<Navigate to="/" />}
//       />

//     </Routes>

//   );

// }
// 