// 用户中心下拉菜单功能
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log("初始化开始...");
        
        // 防止初始化函数出错导致整个页面无法加载
        try {
            initTotalAssets();
            console.log("总资产初始化完成");
        } catch (e) {
            console.error("总资产初始化失败:", e);
        }
        
        try {
            initAssetComposition();
            console.log("资产组成初始化完成");
        } catch (e) {
            console.error("资产组成初始化失败:", e);
        }
        
        try {
            initCurrencyList();
            console.log("币种列表初始化完成");
        } catch (e) {
            console.error("币种列表初始化失败:", e);
        }
        
        try {
            initRecentTransactions();
            console.log("最近交易初始化完成");
        } catch (e) {
            console.error("最近交易初始化失败:", e);
        }
        
        try {
            initCurrencyFilter();
            console.log("币种筛选初始化完成");
        } catch (e) {
            console.error("币种筛选初始化失败:", e);
        }
        
        try {
            initAssetCurrencySelector();
            console.log("资产币种选择器初始化完成");
        } catch (e) {
            console.error("资产币种选择器初始化失败:", e);
        }

        // 初始化提示工具
        try {
            if (typeof tippy === 'function') {
                const tooltipConfig = {
                    placement: 'top',
                    arrow: true,
                    theme: 'light',
                    maxWidth: 300,
                    animation: 'scale',
                    duration: 200
                };
                
                const tooltipElements = ['#unavailableTooltip', '#totalAssetsTooltip'];
                tooltipElements.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        tippy(selector, {
                            ...tooltipConfig,
                            theme: 'light',
                            placement: selector === '#totalAssetsTooltip' ? 'right' : 'top',
                            content: selector === '#totalAssetsTooltip' ? 
                                '系统根据汇率以选定币种估算的当前账户总余额，仅供参考' : 
                                element.getAttribute('data-tippy-content')
                        });
                    }
                });
                console.log("提示工具初始化完成");
            } else {
                console.warn("tippy.js 未加载");
            }
        } catch (e) {
            console.error("提示工具初始化失败:", e);
        }
        
        console.log("所有初始化完成");
    } catch (error) {
        console.error("初始化过程中出现错误:", error);
    }
});

// 货币数据模拟
const mockData = {
    exchangeRates: {
        USD: 1,
        CNH: 7.25,
        EUR: 0.92,
        GBP: 0.78,
        JPY: 150.25,
        HKD: 7.82,
        SGD: 1.35
    },
    currencies: [
        {
            code: 'CNH',
            name: '跨境人民币',
            flag: 'cn',
            available: 987654.32,
            unavailable: 35280.00,
            exchangeLimit: 1000000.00,
            accountCount: 3,
            isMain: true,
            color: '#3b82f6' // 蓝色
        },
        {
            code: 'USD',
            name: '美元',
            flag: 'us',
            available: 76543.21,
            unavailable: 2345.68,
            exchangeLimit: 150000.00,
            accountCount: 2,
            isMain: true,
            color: '#10b981' // 绿色
        },
        {
            code: 'EUR',
            name: '欧元',
            flag: 'eu',
            available: 25432.10,
            unavailable: 1000.00,
            exchangeLimit: 120000.00,
            accountCount: 1,
            isMain: true,
            color: '#f59e0b' // 黄色
        },
        {
            code: 'GBP',
            name: '英镑',
            flag: 'gb',
            available: 12345.67,
            unavailable: 234.57,
            exchangeLimit: 100000.00,
            accountCount: 1,
            isMain: true,
            color: '#8b5cf6' // 紫色
        },
        {
            code: 'JPY',
            name: '日元',
            flag: 'jp',
            available: 8765432,
            unavailable: 123456,
            exchangeLimit: 10000000,
            accountCount: 1,
            isMain: false,
            color: '#ec4899' // 粉色
        },
        {
            code: 'HKD',
            name: '港币',
            flag: 'hk',
            available: 543210.00,
            unavailable: 12345.00,
            exchangeLimit: 800000.00,
            accountCount: 1,
            isMain: false,
            color: '#ef4444' // 红色
        },
        {
            code: 'SGD',
            name: '新加坡元',
            flag: 'sg',
            available: 34567.89,
            unavailable: 987.65,
            exchangeLimit: 500000.00,
            accountCount: 1,
            isMain: false,
            color: '#6366f1' // 靛蓝色
        }
    ],
    recentTransactions: [
        {
            type: 'income',
            title: '收款',
            description: '来自 Amazon 平台',
            amount: '+$12,345.67',
            time: '2024-03-21 10:30',
            icon: 'arrow-down',
            iconBg: 'blue'
        },
        {
            type: 'exchange',
            title: '兑换',
            description: 'USD 转换为 CNY',
            amount: '$5,000 → ¥32,500',
            time: '2024-03-20 14:25',
            icon: 'exchange-alt',
            iconBg: 'purple'
        },
        {
            type: 'payment',
            title: '付款',
            description: '供应商付款',
            amount: '-¥8,643.21',
            time: '2024-03-20 09:15',
            icon: 'arrow-up',
            iconBg: 'red'
        },
        {
            type: 'income',
            title: '收款',
            description: '来自 Shopify 店铺',
            amount: '+€4,321.00',
            time: '2024-03-19 16:45',
            icon: 'arrow-down',
            iconBg: 'green'
        },
        {
            type: 'withdrawal',
            title: '提现',
            description: '至中国银行账户',
            amount: '-¥50,000.00',
            time: '2024-03-18 11:20',
            icon: 'wallet',
            iconBg: 'yellow'
        }
    ],
    USD: {
        total: 10000.00,
        available: 8500.00,
        unavailable: 1500.00,
        symbol: '$'
    },
    CNH: {
        total: 72000.00,
        available: 61200.00,
        unavailable: 10800.00,
        symbol: '¥'
    },
    EUR: {
        total: 9200.00,
        available: 7820.00,
        unavailable: 1380.00,
        symbol: '€'
    },
    GBP: {
        total: 7900.00,
        available: 6715.00,
        unavailable: 1185.00,
        symbol: '£'
    }
};

// 格式化货币
function formatCurrency(amount, currency, options = {}) {
    const currencySymbols = {
        'USD': '$',
        'CNH': '¥',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'HKD': 'HK$',
        'SGD': 'S$'
    };
    
    const formatter = new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // 如果是总资产预览部分，只返回数字部分
    if (options.isTotal) {
        return formatter.format(amount).replace(/[^\d.,]/g, '');
    }
    
    // 如果是资产组成部分，显示金额后跟币种
    if (options.isComposition) {
        const formattedAmount = formatter.format(amount);
        const symbol = currencySymbols[currency] || '';
        
        // 移除原始货币符号，添加自定义符号
        let result = formattedAmount.replace(/[^\d.,]/g, '');
        return `${symbol}${result}`;
    }
    
    return formatter.format(amount);
}

// 更新资产显示
function updateAssetDisplay(currency, options = { updateFilter: true }) {
    const data = mockData[currency];
    if (!data) return;

    // 更新货币符号
    document.querySelectorAll('.currency-symbol').forEach(el => {
        el.textContent = data.symbol;
    });

    // 更新金额
    document.getElementById('totalAssetsValue').innerHTML = 
        `<span class="currency-symbol">${data.symbol}</span>${formatCurrency(data.total, currency, { isTotal: true })}`;
    document.getElementById('availableAssetsValue').innerHTML = 
        `<span class="currency-symbol">${data.symbol}</span>${formatCurrency(data.available, currency, { isTotal: true })}`;
    document.getElementById('unavailableAssetsValue').innerHTML = 
        `<span class="currency-symbol">${data.symbol}</span>${formatCurrency(data.unavailable, currency, { isTotal: true })}`;

    // 更新币种选择器显示
    const selectedCurrency = document.getElementById('selectedCurrency');
    if (selectedCurrency) {
        selectedCurrency.textContent = currency;
    }

    // 更新资产组成的币种标签
    const currencyNames = {
        'USD': '美元',
        'CNH': '人民币',
        'EUR': '欧元',
        'GBP': '英镑',
        'JPY': '日元',
        'HKD': '港币',
        'SGD': '新加坡元'
    };
    const compositionCurrencyLabel = document.getElementById('compositionCurrencyLabel');
    if (compositionCurrencyLabel) {
        compositionCurrencyLabel.textContent = currencyNames[currency] || currency;
    }

    // 更新资产组成
    updateAssetComposition(currency);
}

// 初始化总资产
function initTotalAssets() {
    // 默认使用USD显示总资产，但不更新筛选器
    updateAssetDisplay('USD', { updateFilter: false });
}

// 初始化资产币种选择器
function initAssetCurrencySelector() {
    try {
        console.log("开始初始化资产币种选择器...");
        const assetCurrencyBtn = document.getElementById('assetCurrencyBtn');
        const assetCurrencyDropdown = document.getElementById('assetCurrencyDropdown');
        
        if (!assetCurrencyBtn || !assetCurrencyDropdown) {
            console.error("找不到资产币种选择器元素");
            return;
        }
        
        let isDropdownVisible = false;

        // 点击按钮时切换下拉菜单的显示状态
        assetCurrencyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isDropdownVisible = !isDropdownVisible;
            if (isDropdownVisible) {
                assetCurrencyDropdown.classList.remove('hidden');
            } else {
                hideAssetCurrencyDropdown();
            }
        });

        // 点击页面其他地方时关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!assetCurrencyDropdown.contains(e.target) && !assetCurrencyBtn.contains(e.target)) {
                hideAssetCurrencyDropdown();
            }
        });

        // 币种选择
        const currencyButtons = assetCurrencyDropdown.querySelectorAll('button');
        currencyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const currency = button.getAttribute('data-currency');
                if (currency) {
                updateAssetDisplay(currency);
                }
                hideAssetCurrencyDropdown();
            });
        });

        // 阻止下拉菜单内部点击事件冒泡
        assetCurrencyDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 隐藏下拉菜单的函数
        function hideAssetCurrencyDropdown() {
            isDropdownVisible = false;
            assetCurrencyDropdown.classList.add('hidden');
        }
        
        console.log("资产币种选择器初始化完成");
    } catch (error) {
        console.error("初始化资产币种选择器时出错:", error);
    }
}

// 初始化资产组成饼图
function initAssetComposition() {
    // 默认使用USD显示资产组成，但不更新筛选器
    updateAssetDisplay('USD', { updateFilter: false });
}

// 更新资产组成饼图数据
function updateAssetComposition(currency) {
    try {
        console.log(`开始更新资产组成 (${currency})...`);
        
        // 获取Canvas元素
        const canvas = document.getElementById('assetComposition');
        if (!canvas) {
            console.error('找不到资产组成Canvas元素');
            // 即使找不到Canvas元素，也尝试生成列表数据
            generateCompositionList(currency);
            return;
        }
        
        // 确保Chart.js已加载
        if (typeof Chart === 'undefined') {
            console.error('Chart.js未加载，无法创建图表');
            // 仍然生成列表数据
            generateCompositionList(currency);
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        // 计算每种币种的总资产（可用+不可用）并转换为选定币种
        const currencyTotals = mockData.currencies.map(curr => {
            const totalInCurrency = curr.available + curr.unavailable;
            // 如果是选定的币种，不需要转换
            if (curr.code === currency) {
                return {
                    code: curr.code,
                    name: curr.name,
                    flag: curr.flag,
                    color: curr.color,
                    total: totalInCurrency,
                    totalConverted: totalInCurrency
                };
            }
            
            // 其他币种需要转换为选定币种
            const rate = mockData.exchangeRates[currency] / mockData.exchangeRates[curr.code];
            const convertedTotal = totalInCurrency * rate;
            
            return {
                code: curr.code,
                name: curr.name,
                flag: curr.flag,
                color: curr.color,
                total: totalInCurrency,
                totalConverted: convertedTotal
            };
        });
        
        // 计算转换后的总资产
        const grandTotal = currencyTotals.reduce((sum, curr) => sum + curr.totalConverted, 0);
        
        // 生成币种占比列表HTML
        generateCompositionList(currency, currencyTotals, grandTotal);
        console.log("币种占比列表生成完成");
        
        // 使用setTimeout让UI有机会更新，防止图表渲染阻塞UI
        setTimeout(() => {
            try {
                // 生成饼图数据
                const chartData = {
                    labels: currencyTotals.map(curr => curr.code),
                    datasets: [{
                        data: currencyTotals.map(curr => curr.totalConverted),
                        backgroundColor: currencyTotals.map(curr => curr.color),
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                };
                
                // 如果已经有图表，销毁它
                if (window.assetChart) {
                    try {
                        window.assetChart.destroy();
                    } catch (error) {
                        console.warn('销毁旧图表时出错:', error);
                    }
                }
                
                // 创建新的饼图
                const chartOptions = {
                    cutout: '60%',
                    responsive: true,
                    maintainAspectRatio: true,
                    layout: {
                        padding: 0
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            titleFont: {
                                size: 11
                            },
                            bodyFont: {
                                size: 10
                            },
                            callbacks: {
                                label: function(context) {
                                    const currIndex = context.dataIndex;
                                    const curr = currencyTotals[currIndex];
                                    const percentage = ((curr.totalConverted / grandTotal) * 100).toFixed(1);
                                    return `${curr.code}: ${formatCurrency(curr.totalConverted, currency, { isComposition: true })} (${percentage}%)`;
                                }
                            }
                        }
                    }
                };
                
                window.assetChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: chartData,
                    options: chartOptions
                });
                
                console.log('资产组成图表创建成功');
            } catch (chartError) {
                console.error('创建资产组成图表时出错:', chartError);
            }
        }, 100);
        
    } catch (error) {
        console.error('更新资产组成时出错:', error);
    }
}

// 生成币种占比列表
function generateCompositionList(currency, currencyTotals, grandTotal) {
    try {
        console.log("开始生成币种占比列表...");
        
        // 如果未提供currencyTotals，则重新计算
        if (!currencyTotals) {
            const rate = mockData.exchangeRates[currency];
            currencyTotals = mockData.currencies.map(curr => {
                const totalInCurrency = curr.available + curr.unavailable;
                if (curr.code === currency) {
                    return {
                        code: curr.code,
                        name: curr.name,
                        flag: curr.flag,
                        color: curr.color,
                        total: totalInCurrency,
                        totalConverted: totalInCurrency
                    };
                }
                
                const currencyRate = mockData.exchangeRates[curr.code] || 1;
                const convertedTotal = (totalInCurrency / currencyRate) * rate;
                
                return {
                    code: curr.code,
                    name: curr.name,
                    flag: curr.flag,
                    color: curr.color,
                    total: totalInCurrency,
                    totalConverted: convertedTotal
                };
            });
            
            grandTotal = currencyTotals.reduce((sum, curr) => sum + curr.totalConverted, 0);
        }
        
        const currencyCompositionList = document.getElementById('currencyCompositionList');
        if (!currencyCompositionList) {
            console.error('找不到币种占比列表元素');
            return;
        }
        
        // 限制渲染的币种数量，减少DOM操作
        const limitedCurrencies = currencyTotals.slice(0, 6);
        const htmlContent = limitedCurrencies.map(curr => {
            const percentage = ((curr.totalConverted / grandTotal) * 100).toFixed(1);
            return `
                <div class="currency-item border border-gray-100 rounded-md p-1.5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-1.5 h-1.5 rounded-full mr-1" style="background-color: ${curr.color}"></div>
                            <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${curr.flag}.svg" 
                                class="w-3 h-3 rounded-full mr-1" alt="${curr.code}">
                            <span class="text-xs font-medium text-gray-700">${curr.code}</span>
                        </div>
                        <span class="text-xs text-gray-500">${percentage}%</span>
                    </div>
                    <div class="text-xs font-semibold text-gray-900 mt-1 text-right">
                        ${formatCurrency(curr.totalConverted, currency, { isComposition: true })}
                    </div>
                </div>
            `;
        }).join('');
        
        currencyCompositionList.innerHTML = htmlContent;
        
        console.log('币种占比列表生成成功');
    } catch (error) {
        console.error('生成币种占比列表时出错:', error);
    }
}

// 生成币种列表行HTML
function generateCurrencyRow(currency) {
    // 为USD添加特殊提示
    const usdTooltip = currency.code === 'USD' ? `
        <div class="inline-flex items-center">
            ${formatCurrency(currency.available, currency.code)}
            <i class="fas fa-info-circle text-gray-400 ml-1 cursor-help" 
               data-tippy-content="其中金额100.00USD仅支持商务卡中使用"></i>
        </div>
    ` : formatCurrency(currency.available, currency.code);

    return `
        <tr class="currency-row border-b border-gray-100">
            <td class="px-5 py-4">
                <div class="flex items-center">
                    <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${currency.flag}.svg" 
                         class="currency-flag mr-3" 
                         alt="${currency.code}">
                    <div>
                        <div class="font-medium text-gray-900">${currency.name}</div>
                        <div class="text-sm text-gray-500">${currency.code}</div>
                    </div>
                </div>
            </td>
            <td class="px-5 py-4 text-right">
                <div class="font-medium text-gray-900">${usdTooltip}</div>
            </td>
            <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end">
                    <span class="font-medium text-gray-900">${formatCurrency(currency.unavailable, currency.code)}</span>
                    <i class="fas fa-lock text-red-500 text-xs ml-1"></i>
                </div>
            </td>
        </tr>
    `;
}

// 初始化币种列表
function initCurrencyList() {
    const mainCurrencies = mockData.currencies.filter(c => c.isMain);
    const otherCurrencies = mockData.currencies.filter(c => !c.isMain);
    
    const mainCurrencyList = document.getElementById('mainCurrencyList');
    const moreCurrencyList = document.getElementById('moreCurrencyList');
    
    if (!mainCurrencyList || !moreCurrencyList) {
        console.error("找不到币种列表元素");
        return;
    }

    // 显示所有币种
    mainCurrencyList.innerHTML = mainCurrencies.map(generateCurrencyRow).join('');
    moreCurrencyList.innerHTML = otherCurrencies.map(generateCurrencyRow).join('');
    
    // 如果没有更多币种，隐藏切换按钮
    const toggleButton = document.getElementById('toggleCurrencies');
    if (otherCurrencies.length === 0) {
        toggleButton.parentElement.style.display = 'none';
    } else {
        toggleButton.addEventListener('click', toggleCurrencyList);
    }

    // 确保筛选器显示"全部币种"
    const selectedFilter = document.getElementById('selectedFilter');
    if (selectedFilter) {
        selectedFilter.innerHTML = '<span>全部币种</span>';
    }

    // 初始化提示工具
    if (typeof tippy === 'function') {
        tippy('[data-tippy-content]', {
            placement: 'top',
            arrow: true,
            theme: 'light',
            maxWidth: 300,
            animation: 'scale',
            duration: 200
        });
    }
}

// 切换币种列表显示/隐藏
function toggleCurrencyList() {
    const moreCurrencyList = document.getElementById('moreCurrencyList');
    const toggleButton = document.getElementById('toggleCurrencies');
    const showMore = toggleButton.querySelector('.show-more');
    const showLess = toggleButton.querySelector('.show-less');
    const icon = toggleButton.querySelector('.currency-toggle');
    
    if (moreCurrencyList.classList.contains('hidden')) {
        moreCurrencyList.classList.remove('hidden');
        showMore.classList.add('hidden');
        showLess.classList.remove('hidden');
        icon.classList.add('rotate');
    } else {
        moreCurrencyList.classList.add('hidden');
        showMore.classList.remove('hidden');
        showLess.classList.add('hidden');
        icon.classList.remove('rotate');
    }
}

// 初始化近期交易
function initRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    container.innerHTML = mockData.recentTransactions.map(transaction => `
        <div class="flex items-center py-3 border-b border-gray-100 last:border-0">
            <div class="w-10 h-10 rounded-full bg-${transaction.iconBg}-100 flex items-center justify-center text-${transaction.iconBg}-600 mr-3">
                <i class="fas fa-${transaction.icon}"></i>
            </div>
            <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-800">${transaction.title}</h4>
                <p class="text-xs text-gray-500">${transaction.description}</p>
            </div>
            <div class="text-right">
                <p class="text-sm font-medium ${transaction.type === 'payment' || transaction.type === 'withdrawal' ? 'text-red-600' : transaction.type === 'exchange' ? 'text-blue-600' : 'text-green-600'}">${transaction.amount}</p>
                <p class="text-xs text-gray-500">${transaction.time}</p>
            </div>
        </div>
    `).join('');

    // 添加查看全部链接的点击事件处理
    document.addEventListener('click', function(e) {
        const viewAllLink = e.target.closest('.view-all-transactions');
        if (viewAllLink) {
            e.preventDefault();
            // 使用相对路径导航到交易查询页面
            window.location.href = './transactions.html';
        }
    });
}

// 更新币种列表显示
function updateCurrencyList(filter) {
    const mainCurrencyList = document.getElementById('mainCurrencyList');
    const moreCurrencyList = document.getElementById('moreCurrencyList');
    const toggleButton = document.getElementById('toggleCurrencies');
    
    if (!mainCurrencyList || !moreCurrencyList || !toggleButton) {
        console.error("找不到币种列表必要元素");
        return;
    }

        const mainCurrencies = mockData.currencies.filter(c => c.isMain);
        const otherCurrencies = mockData.currencies.filter(c => !c.isMain);
        
    // 始终显示所有币种
    mainCurrencyList.innerHTML = mainCurrencies.map(currency => {
        // 为USD添加特殊提示
        const availableAmount = currency.code === 'USD' ? `
            <div class="inline-flex items-center">
                ${formatCurrency(currency.available, currency.code)}
                <i class="fas fa-info-circle text-gray-400 ml-1 cursor-help" 
                   data-tippy-content="其中金额100.00USD仅支持商务卡中使用"></i>
            </div>
        ` : formatCurrency(currency.available, currency.code);

        return `
            <tr class="currency-row border-b border-gray-100" data-currency="${currency.code}">
                <td class="px-5 py-4">
                    <div class="flex items-center">
                        <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${currency.flag}.svg" 
                             class="currency-flag mr-3" 
                             alt="${currency.code}">
                        <div>
                            <div class="font-medium text-gray-900">${currency.name}</div>
                            <div class="text-sm text-gray-500">${currency.code}</div>
                        </div>
                    </div>
                </td>
                <td class="px-5 py-4 text-right">
                    <div class="font-medium text-gray-900">${availableAmount}</div>
                </td>
                <td class="px-5 py-4 text-right">
                    <div class="flex items-center justify-end">
                        <span class="font-medium text-gray-900">${formatCurrency(currency.unavailable, currency.code)}</span>
                        <i class="fas fa-lock text-red-500 text-xs ml-1"></i>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    moreCurrencyList.innerHTML = otherCurrencies.map(currency => {
        // 为USD添加特殊提示
        const availableAmount = currency.code === 'USD' ? `
            <div class="inline-flex items-center">
                ${formatCurrency(currency.available, currency.code)}
                <i class="fas fa-info-circle text-gray-400 ml-1 cursor-help" 
                   data-tippy-content="其中金额100.00USD仅支持商务卡中使用"></i>
            </div>
        ` : formatCurrency(currency.available, currency.code);

        return `
            <tr class="currency-row border-b border-gray-100" data-currency="${currency.code}">
                <td class="px-5 py-4">
                    <div class="flex items-center">
                        <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${currency.flag}.svg" 
                             class="currency-flag mr-3" 
                             alt="${currency.code}">
                        <div>
                            <div class="font-medium text-gray-900">${currency.name}</div>
                            <div class="text-sm text-gray-500">${currency.code}</div>
                        </div>
                    </div>
                </td>
                <td class="px-5 py-4 text-right">
                    <div class="font-medium text-gray-900">${availableAmount}</div>
                </td>
                <td class="px-5 py-4 text-right">
                    <div class="flex items-center justify-end">
                        <span class="font-medium text-gray-900">${formatCurrency(currency.unavailable, currency.code)}</span>
                        <i class="fas fa-lock text-red-500 text-xs ml-1"></i>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // 应用筛选
    const allRows = document.querySelectorAll('.currency-row');
    allRows.forEach(row => {
        if (filter === 'all' || row.dataset.currency === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });

    // 根据是否有其他币种来显示/隐藏切换按钮
    const hasVisibleOtherCurrencies = filter === 'all' || otherCurrencies.some(c => c.code === filter);
    toggleButton.parentElement.style.display = hasVisibleOtherCurrencies ? 'block' : 'none';

        // 重置展开/收起状态
        moreCurrencyList.classList.add('hidden');
        const showMore = toggleButton.querySelector('.show-more');
        const showLess = toggleButton.querySelector('.show-less');
        const icon = toggleButton.querySelector('.currency-toggle');
    if (showMore && showLess && icon) {
        showMore.classList.remove('hidden');
        showLess.classList.add('hidden');
        icon.classList.remove('rotate');
    }

    // 初始化提示工具
    if (typeof tippy === 'function') {
        tippy('[data-tippy-content]', {
            placement: 'top',
            arrow: true,
            theme: 'light',
            maxWidth: 300,
            animation: 'scale',
            duration: 200
        });
    }
}

// 初始化币种筛选功能
function initCurrencyFilter() {
    const filterBtn = document.getElementById('currencyFilterBtn');
    const filterDropdown = document.getElementById('currencyFilterDropdown');
    const selectedFilter = document.getElementById('selectedFilter');
    const chevronIcon = filterBtn?.querySelector('.fa-chevron-down');
    const searchInput = document.getElementById('currencySearch');
    const currencyList = document.getElementById('currencyList');
    let isFilterDropdownVisible = false;

    if (!filterBtn || !filterDropdown || !selectedFilter || !currencyList) {
        console.error("找不到币种筛选器必要元素");
        return;
    }

    // 默认显示全部币种
    selectedFilter.innerHTML = '<span>全部币种</span>';
    updateCurrencyList('all');

    // 移除之前的定位样式
    if (filterDropdown) {
        filterDropdown.style.removeProperty('bottom');
        filterDropdown.style.removeProperty('top');
        filterDropdown.style.removeProperty('marginBottom');
    }

    // 搜索功能
    searchInput?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const currencyButtons = currencyList.querySelectorAll('button');
        
        currencyButtons.forEach(button => {
            const currencyCode = button.dataset.filter;
            const currency = mockData.currencies.find(c => c.code === currencyCode);
            if (!currency) return;
            
            const searchString = `${currency.code} ${currency.name}`.toLowerCase();
            const isMatch = searchString.includes(searchTerm);
            button.style.display = isMatch ? 'block' : 'none';
        });
    });

    // 防止搜索框点击事件关闭下拉菜单
    searchInput?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 清空搜索框当下拉菜单关闭时
    function clearSearch() {
        if (searchInput) {
        searchInput.value = '';
        const currencyButtons = currencyList.querySelectorAll('button');
        currencyButtons.forEach(button => {
            button.style.display = 'block';
        });
        }
    }

    // 点击按钮时切换下拉菜单
    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isFilterDropdownVisible = !isFilterDropdownVisible;
        if (isFilterDropdownVisible) {
            filterDropdown.classList.remove('hidden');
            if (chevronIcon) {
            chevronIcon.style.transform = 'rotate(180deg)';
            }
            searchInput?.focus();
        } else {
            hideFilterDropdown();
        }
    });

    // 点击页面其他地方时关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!filterDropdown.contains(e.target) && !filterBtn.contains(e.target)) {
            hideFilterDropdown();
        }
    });

    // 阻止下拉菜单内部点击事件冒泡
    filterDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 点击筛选选项
    currencyList.addEventListener('click', function(e) {
        const button = e.target.closest('button[data-filter]');
        if (!button) return;

        const filter = button.getAttribute('data-filter');
        console.log('Selected filter:', filter); // 添加调试日志

        // 更新选中的筛选器显示
        if (filter === 'all') {
            selectedFilter.innerHTML = '<span>全部币种</span>';
            updateCurrencyList('all');
        } else {
            const currencyData = mockData.currencies.find(c => c.code === filter);
            if (currencyData) {
                selectedFilter.innerHTML = `
                    <div class="flex items-center">
                        <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${currencyData.flag}.svg" 
                             class="w-4 h-4 rounded-full mr-2" 
                             alt="${filter}">
                        <span class="font-medium">${currencyData.code}</span>
                        <span class="text-gray-500 ml-1">${currencyData.name}</span>
                    </div>
                `;
                updateCurrencyList(filter);
            }
        }
        
        // 确保更新币种列表显示
        if (filter === 'all') {
            const allRows = document.querySelectorAll('.currency-row');
            allRows.forEach(row => {
                row.style.display = '';
            });
        }
        
        hideFilterDropdown();
    });

    // 隐藏下拉菜单
    function hideFilterDropdown() {
        isFilterDropdownVisible = false;
        filterDropdown.classList.add('hidden');
        if (chevronIcon) {
        chevronIcon.style.transform = 'rotate(0deg)';
        }
        clearSearch();
    }
}