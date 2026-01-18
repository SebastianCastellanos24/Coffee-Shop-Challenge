import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [total, setTotal] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [lowStock, setLowStock] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatCOP = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(value);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setCheckingSession(false);

      if (data.session) {
        loadMetrics();
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function loadMetrics() {
    try {
      setLoading(true);
      setError(null);

      const [
        totalRevenueRes,
        lowStockRes,
        topProductsRes,
        totalSalesRes,
        totalCustomersRes,
        topCustomersRes
      ] = await Promise.all([
        supabase.rpc("total_revenue"),
        supabase.rpc("low_stock"),
        supabase.rpc("top_products"),
        supabase.rpc("total_sales"),
        supabase.rpc("total_customers"),
        supabase.rpc("top_customers")
      ]);

      if (totalRevenueRes.error) throw totalRevenueRes.error;
      if (lowStockRes.error) throw lowStockRes.error;
      if (topProductsRes.error) throw topProductsRes.error;
      if (totalSalesRes.error) throw totalSalesRes.error;
      if (totalCustomersRes.error) throw totalCustomersRes.error;
      if (topCustomersRes.error) throw topCustomersRes.error;

      setTotal(totalRevenueRes.data || 0);
      setTotalSales(totalSalesRes.data || 0);
      setTotalCustomers(totalCustomersRes.data || 0);
      setLowStock(lowStockRes.data || []);
      setTopProducts(topProductsRes.data || []);
      setTopCustomers(topCustomersRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Error cargando métricas del dashboard");
    } finally {
      setLoading(false);
    }
  }

  /*Verificar datos de login*/
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2]">
        <p className="text-[#4b2e1f]">Verificando sesión...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2]">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-xl font-bold text-[#4b2e1f] mb-2">
            Acceso restringido
          </h2>
          <p className="text-gray-600">
            Debes iniciar sesión para acceder al dashboard
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2]">
        <p className="text-[#4b2e1f]">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#4b2e1f]">
            Dashboard · Coffee Shop
          </h1>
          <p className="text-gray-600">
            Resumen general del negocio
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-sm text-gray-500 mb-1">Ingresos totales</p>
            <p className="text-4xl font-bold text-[#4b2e1f]">
              {formatCOP(total)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-sm text-gray-500 mb-1">Ventas totales</p>
            <p className="text-4xl font-bold text-[#4b2e1f]">
              {totalSales}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-sm text-gray-500 mb-1">Clientes</p>
            <p className="text-4xl font-bold text-[#4b2e1f]">
              {totalCustomers}
            </p>
          </div>
        </div>

        {/* Grid inferior */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Stock bajo */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-[#4b2e1f] mb-3">
              Alertas de stock
            </h3>

            {lowStock.length === 0 ? (
              <p className="text-sm text-gray-500">
                Todo el inventario está en niveles correctos
              </p>
            ) : (
              <ul className="space-y-2">
                {lowStock.map(product => (
                  <li
                    key={product.id}
                    className="flex justify-between text-sm"
                  >
                    <span>{product.name}</span>
                    <span className="text-red-600 font-semibold">
                      {product.stock}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Top productos */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-[#4b2e1f] mb-3">
              Top productos vendidos
            </h3>

            {topProducts.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aún no hay ventas registradas
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between font-semibold border-b border-[#4b2e1f] pb-2">
                  <p className="w-1/2">Producto</p>
                  <p className="w-1/6 text-right">Precio</p>
                  <p className="w-1/6 text-right">Vendidos</p>
                  <p className="w-1/6 text-right">Ganancia</p>
                </div>

                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex justify-between bg-[#f8f5f2] px-3 py-2 rounded-lg text-sm"
                  >
                    <p className="w-1/2">
                      <span className="font-bold mr-2">#{index + 1}</span>
                      {product.name}
                    </p>
                    <p className="w-1/6 text-right">
                      {formatCOP(product.price)}
                    </p>
                    <p className="w-1/6 text-right">
                      {product.total_sold}
                    </p>
                    <p className="w-1/6 text-right">
                      {formatCOP(product.total_sold * product.price)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top clientes */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-[#4b2e1f] mb-3 text-2xl">
            Top 5 clientes
          </h3>

          {topCustomers.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hay clientes registrados
            </p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-4 font-semibold border-b border-[#4b2e1f] pb-2">
                <p>Cliente</p>
                <p>Email</p>
                <p className="text-center">Compras</p>
                <p className="text-right">Total</p>
              </div>

              {topCustomers.map((customer, index) => (
                <div
                  key={customer.email}
                  className="grid grid-cols-4 bg-[#f8f5f2] rounded-lg px-4 py-2 text-sm"
                >
                  <p>
                    <span className="font-bold mr-2">#{index + 1}</span>
                    {customer.nombre}
                  </p>
                  <p className="truncate">{customer.email}</p>
                  <p className="text-center">{customer.total_ventas}</p>
                  <p className="text-right">
                    {formatCOP(customer.total_gastado)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
