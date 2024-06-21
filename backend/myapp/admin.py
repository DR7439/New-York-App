from django.contrib import admin
from .models import CustomUser, Zone, Search, Busyness, Demographic

class CustomUserAdmin(admin.ModelAdmin):
    """
    Admin interface options for CustomUser model.

    This class customizes the admin interface for the CustomUser model, 
    adding display, search, filter, and ordering options.
    """
    list_display = ('username', 'email', 'name', 'credits', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'name')
    list_filter = ('is_staff', 'is_active')
    ordering = ('username',)

admin.site.register(CustomUser, CustomUserAdmin)

class ZoneAdmin(admin.ModelAdmin):
    """
    Admin interface options for Zone model.

    This class customizes the admin interface for the Zone model, 
    adding display and search options.
    """
    list_display = ('name',)
    search_fields = ('name',)

admin.site.register(Zone, ZoneAdmin)

class SearchAdmin(admin.ModelAdmin):
    """
    Admin interface options for Search model.

    This class customizes the admin interface for the Search model, 
    adding display, search, filter, and ordering options.
    """
    list_display = ('name', 'user', 'date_of_advertising', 'date_search_made_on', 'min_age', 'max_age', 'gender')
    search_fields = ('name', 'user__username', 'user__email')
    list_filter = ('date_of_advertising', 'date_search_made_on', 'gender')
    ordering = ('date_search_made_on',)

admin.site.register(Search, SearchAdmin)

class BusynessAdmin(admin.ModelAdmin):
    """
    Admin interface options for Busyness model.

    This class customizes the admin interface for the Busyness model, 
    adding display, search, filter, and ordering options.
    """
    list_display = ('datetime', 'zone', 'busyness_score')
    search_fields = ('zone__name',)
    list_filter = ('datetime', 'zone')
    ordering = ('datetime',)

admin.site.register(Busyness, BusynessAdmin)

class DemographicAdmin(admin.ModelAdmin):
    """
    Admin interface options for Demographic model.

    This class customizes the admin interface for the Demographic model, 
    adding display, search, filter, and ordering options.
    """
    list_display = ('datetime', 'zone', 'search', 'score')
    search_fields = ('zone__name', 'search__name')
    list_filter = ('datetime', 'zone', 'search')
    ordering = ('datetime',)

admin.site.register(Demographic, DemographicAdmin)
